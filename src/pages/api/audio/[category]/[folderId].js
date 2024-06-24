// src/pages/api/audio/[category]/[folderId].js

const fs = require('fs').promises;
const path = require('path');
const slugify = require('slugify');
const getMP3Duration = require('get-mp3-duration');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { category, folderId } = req.query;

    try {
      let folderPath = '';

      if (category === 'moods') {
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'moods_based', folderId);
      } else if (category === 'musicians') {
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'musician_contributed', folderId);
      } else {
        res.status(404).json({ error: 'Invalid category' });
        return;
      }
      if(folderId ==='mood_based'){
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'moods_based');
      }else if(folderId ==='musician_based'){
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'musician_contributed');
      }

      const audioFiles = await getAudioFiles(folderPath);
      res.status(200).json(audioFiles);
    } catch (error) {
      console.error(`Error processing audio files for ${category}/${folderId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function getAudioFiles(folderPath) {
  const files = await fs.readdir(folderPath);
  const audioFiles = files.filter(file => path.extname(file) === '.mp3');
  const thumbnailFile = files.find(file => path.extname(file) === '.png' || path.extname(file) === '.jpg');

  const audioData = await Promise.all(
    audioFiles.map(async (audioFile) => {
      const audioFilePath = path.join(folderPath, audioFile);
      const audioBuffer = await fs.readFile(audioFilePath);
      const duration = await getMP3Duration(audioBuffer);
      
      return {
        id: slugify(audioFile, { lower: true }),
        uri: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/${category === 'moods' ? 'moods_based' : 'musician_contributed'}/${folderId}/${audioFile}`,
        thumbUri: thumbnailFile
          ? `${process.env.NEXT_PUBLIC_URL_HOSTNAME}/cases/video-ui/audio/${category === 'moods' ? 'moods_based' : 'musician_contributed'}/${folderId}/${thumbnailFile}`
          : undefined,
        duration: duration / 1000,
      };
    })
  );

  return audioData;
}