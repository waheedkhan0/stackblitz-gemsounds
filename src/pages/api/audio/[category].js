// src/pages/api/audio/[category].js

const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { category } = req.query;

    try {
      let folderPath = '';

      if (category === 'moods') {
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'moods_based');
      } else if (category === 'musicians') {
        folderPath = path.join(process.cwd(), 'public', 'cases', 'video-ui', 'audio', 'musician_contributed');
      } else {
        res.status(404).json({ error: 'Invalid category' });
        return;
      }

      const folders = await getFolders(folderPath);
      res.status(200).json(folders);
    } catch (error) {
      console.error(`Error processing ${category} folders:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function getFolders(folderPath) {
  const files = await fs.readdir(folderPath);
  const folders = files.filter(file => !file.startsWith('.')); // Exclude hidden files

  const folderData = folders.map(folder => ({
    id: folder,
    name: folder.replace(/_/g, ' '),
  }));

  return folderData;
}