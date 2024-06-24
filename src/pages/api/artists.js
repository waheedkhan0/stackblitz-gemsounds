const fs = require('fs').promises;
const filesystem = require("fs")
const path = require('path');
const slugify = require('slugify');
const getMP3Duration = require('get-mp3-duration')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const moodsFolderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'musician_contributed');
        console.log('Artists Folder Path:', moodsFolderPath);
        const assets = await processAssets(moodsFolderPath);
      res.status(200).json(assets);
    } catch (error) {
      console.error('Error processing artist-based assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function processAssets(artistsFolderPath) {
  const artistFolders = await fs.readdir(artistsFolderPath);
  const filteredArtistFolders = artistFolders.filter(folder => folder !== '.DS_Store');
  
  const assets = [];

  for (const artistFolder of filteredArtistFolders) {
    const artistFolderPath = path.join(artistsFolderPath, artistFolder);
    const files = await fs.readdir(artistFolderPath);
    const thumbnailFile = files.find(file => path.extname(file) === '.png');
    const encodedThumbnailFile = thumbnailFile ? encodeURIComponent(thumbnailFile) : undefined;
    const artistAssets = await processArtistFolder(artistFolderPath, artistFolder,encodedThumbnailFile,null);
    assets.push(...artistAssets);
  }

  return assets;
}

async function processArtistFolder(artistFolderPath, artistFolder,encodedThumbnailFile,albumFolder) {
  const files = await fs.readdir(artistFolderPath);
  const assets = [];

  // Find the thumbnail file in the artist folder
  // const thumbnailFile = files.find(file => path.extname(file) === '.png');
  // const encodedThumbnailFile = thumbnailFile ? encodeURIComponent(thumbnailFile) : undefined;

  for (const file of files) {
    const filePath = path.join(artistFolderPath, file);
    const stats = await fs.stat(filePath);
    console.log("processing "+filePath);
    if (stats.isDirectory()) {
      const albumFolder = file;
      const albumAssets = await processArtistFolder(filePath, artistFolder,encodedThumbnailFile,albumFolder);
      assets.push(...albumAssets);
    } else if (path.extname(file) === '.mp3' || path.extname(file) === '.wav') {
      // If the file is an MP3, create an asset object for it

      const audioFileName = path.extname(file) === '.mp3'?path.basename(file, '.mp3'):path.basename(file, '.wav');
      const title = audioFileName.replace(/_/g, ' ');
      const id = slugify(title, { lower: true });
      // const thumbnailFile = files.find(file => path.extname(file) === '.png');
      
      const encodedArtistFolder = encodeURIComponent(artistFolder);
      const encodedFile = encodeURIComponent(file);
      // const encodedThumbnailFile = thumbnailFile ? encodeURIComponent(thumbnailFile) : undefined;

      const asset = {
        id,
        locale: 'en',
        label: title,
        "groups":["Musician"],
        meta: {
          uri: albumFolder?`${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/musician_contributed/${encodedArtistFolder}/${albumFolder}/${encodedFile}`:`${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/musician_contributed/${encodedArtistFolder}/${encodedFile}`,
          thumbUri: encodedThumbnailFile ? `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/musician_contributed/${encodedArtistFolder}/${encodedThumbnailFile}` : undefined,
          blockType: '//ly.img.ubq/audio',
          mimeType: 'audio/mpeg',
          duration: await getAudioDuration(filePath),
        },
        context: {
          sourceId: 'artist_based_source',
        },
      };

      assets.push(asset);
    }
  }
  
  
  return assets;
}

async function translateToAssetResult(moodFolderPath) {
  const files = await fs.readdir(moodFolderPath);
  const audioFiles = files.filter((file) => path.extname(file) === '.mp3');
  const thumbnailFile = files.find((file) => path.extname(file) === '.png');

  if (audioFiles.length === 0) {
    console.warn(`No audio files found in ${moodFolderPath}`);
    return [];
  }

  const assets = [];

  for (const audioFile of audioFiles) {
    const audioFileName = path.basename(audioFile, '.mp3');
    const title = audioFileName.replace(/_/g, ' ');
    const id = slugify(title, { lower: true });
    
    const asset = {
      id,
      locale: 'en',
      label: title,
      meta: {
        uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/musician_contributed/${path.basename(moodFolderPath)}/${audioFile}`,
        thumbUri: thumbnailFile
          ? `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/musician_contributed/${path.basename(moodFolderPath)}/${thumbnailFile}`
          : undefined,
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: getAudioDuration(path.join(moodFolderPath, audioFile)),
      },
      context: {
        sourceId: 'artist_based_source',
      },
    };

    assets.push(asset);
  }

  return assets;
}

function getAudioDuration(audioFilePath) {
  try {
    const buffer = filesystem.readFileSync(audioFilePath);
    const duration = getMP3Duration(buffer);
    return duration/1000;
  }
  catch (error) {
    console.error('Error getting audio duration:', error);
    return 0;
  }
}