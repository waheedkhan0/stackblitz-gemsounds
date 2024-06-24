const fs = require('fs').promises;
const filesystem = require("fs")
const path = require('path');
const slugify = require('slugify');
var mp3Duration = require('mp3-duration');
const getMP3Duration = require('get-mp3-duration')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const moodsFolderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'moods_based');
        console.log('Moods Folder Path:', moodsFolderPath);
        const assets = await processAssets(moodsFolderPath);
      res.status(200).json(assets);
    } catch (error) {
      console.error('Error processing mood-based assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function processAssets(moodsFolderPath) {
  const moodFolders = await fs.readdir(moodsFolderPath);
  const filteredMoodFolders = moodFolders.filter(folder => folder !== '.DS_Store');
  const assets = [];

  for (const moodFolder of filteredMoodFolders) {
    const moodFolderPath = path.join(moodsFolderPath, moodFolder);
    const moodAssets = await translateToAssetResult(moodFolderPath);
    assets.push(...moodAssets);
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
      "groups":["Mood"],
      meta: {
        uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/moods_based/${path.basename(moodFolderPath)}/${audioFile}`,
        thumbUri: thumbnailFile
          ? `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/moods_based/${path.basename(moodFolderPath)}/${thumbnailFile}`
          : undefined,
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: getAudioDuration(path.join(moodFolderPath, audioFile)),
      },
      context: {
        sourceId: 'mood_based_source',
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