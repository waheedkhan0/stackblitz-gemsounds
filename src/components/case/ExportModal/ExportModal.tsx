import { CreativeEngine, MimeType } from '@cesdk/cesdk-js';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import classes from './ExportModal.module.css';
import { Label } from './components/Label/Label';
import { Resolution } from './components/Resolution/Resolution';
import { SectionDivider } from './components/SectionDivider/SectionDivider';
import { Select } from './components/Select/Select';
import DownloadIcon from './icons/Download.svg';
import LoadingSpinnerIcon from './icons/LoadingSpinner.svg';
import { localDownload } from './lib/localDownload';

interface Props {
  show: boolean;
  onClose: () => void;
  engine: CreativeEngine;
}

const ALL_RESOLUTIONS = {
  'Facebook Reel (Full Portrait - 9:16)': {
    id: 'Facebook Reel (Full Portrait - 9:16)',
    name: 'Facebook Reel (Full Portrait - 9:16)',
    description: '1080x1920',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Facebook Story (Full Portrait - 9:16)': {
    id: 'Facebook Story (Full Portrait - 9:16)',
    name: 'Facebook Story (Full Portrait - 9:16)',
    description: '1080x1920',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Facebook Feed (Landscape - 16:9)': {
    id: 'Facebook Feed (Landscape - 16:9)',
    name: 'Facebook Feed (Landscape - 16:9) ',
    description: '1920x1080',
    value: {
      width: 1920,
      height: 1080
    }
  },
  'Facebook Feed (Square - 1:1)': {
    id: 'Facebook Feed (Square - 1:1)',
    name: 'Facebook Feed (Square - 1:1)',
    description: '1080x1080',
    value: {
      width: 1080,
      height: 1080
    }
  },
  'Facebook Feed (Vertical - 4:5)': {
    id: 'Facebook Feed (Vertical - 4:5)',
    name: 'Facebook Feed (Vertical - 4:5)',
    description: '1080x1350',
    value: {
      width: 1080,
      height: 1350
    }
  },
  'Facebook Feed (Vertical - 2:3)': {
    id: 'Facebook Feed (Vertical - 2:3)',
    name: 'Facebook Feed (Vertical - 2:3)',
    description: '1500x2250',
    value: {
      width: 1500,
      height: 2250
    }
  },
  'Facebook Feed (Full Portrait - 9:16)': {
    id: 'Facebook Feed (Full Portrait - 9:16)',
    name: 'Facebook Feed (Full Portrait - 9:16)',
    description: '1080x1920',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Instagram Reel (Full Portrait - 9:16)': {
    id: 'Instagram Reel (Full Portrait - 9:16)',
    name: 'Instagram Reel (Full Portrait - 9:16)',
    description: '1500x2250',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Instagram Story (Full Portrait - 9:16)': {
    id: 'Instagram Story (Full Portrait - 9:16)',
    name: 'Instagram Story (Full Portrait - 9:16)',
    description: '1500x2250',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Instagram Feed (Square - 1:1)': {
    id: 'Instagram Feed (Square - 1:1)',
    name: 'Instagram Feed (Square - 1:1)',
    description: '1080x1080',
    value: {
      width: 1080,
      height: 1080
    }
  },
  'Instagram Feed (Vertical - 4:5)': {
    id: 'Instagram Feed (Vertical - 4:5)',
    name: 'Instagram Feed (Vertical - 4:5)',
    description: '1080x1350',
    value: {
      width: 1080,
      height: 1350
    }
  },
  'Instagram Feed (Landscape - 16:9)': {
    id: 'Instagram Feed (Landscape - 16:9)',
    name: 'Instagram Feed (Landscape - 16:9)',
    description: '1920x1080',
    value: {
      width: 1920,
      height: 1080
    }
  },
  'IGTV (Landscape - 16:9)': {
    id: 'IGTV (Landscape - 16:9)',
    name: 'IGTV (Landscape - 16:9)',
    description: '1920x1080',
    value: {
      width: 1920,
      height: 1080
    }
  },
  'IGTV (Full Portrait - 9:16)': {
    id: 'IGTV (Full Portrait - 9:16)',
    name: 'IGTV (Full Portrait - 9:16)',
    description: '1080x1920',
    value: {
      width: 1080,
      height: 1920
    }
  },

  'TikTok (Full Portrait - 9:16)': {
    id: 'TikTok (Full Portrait - 9:16)',
    name: 'TikTok (Full Portrait - 9:16)',
    description: '1080x1920',
    value: {
      width: 1080,
      height: 1920
    }
  },
  'Youtube (Landscape - 16:9)': {
    id: 'Youtube (Landscape - 16:9)',
    name: 'Youtube (Landscape - 16:9)',
    description: '1920x1080',
    value: {
      width: 1920,
      height: 1080
    }
  }
};

const getResolution = (engine: CreativeEngine) => {
  const page = engine.scene.getCurrentPage();
  if (!page) {
    return { width: 0, height: 0 };
  }
  const width = engine.block.getWidth(page);
  const height = engine.block.getHeight(page);
  return { width, height };
};

export const ExportModal: React.FC<Props> = ({ show, onClose,engine }) => {
  const [fps, setFps] = useState<number>(30);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  }>(() => getResolution(engine));
  const fpsString = fps.toString();
  const [progress, setProgress] = useState(0);
  const handleVideoExport = useCallback(async () => {
    const page = engine.scene.getCurrentPage();
    if (!page) {
      return;
    }

    setProgress(0);
    const blob = await engine.block.exportVideo(
      page,
      MimeType.Mp4,
      (numberOfRenderedFrames, numberOfEncodedFrames, totalNumberOfFrames) => {
        setProgress(numberOfEncodedFrames / totalNumberOfFrames);
      },
      {
        targetWidth: resolution.width,
        targetHeight: resolution.height,
        framerate: fps
      }
    );
    await localDownload(blob, `my-video`);
    setProgress(0);
  }, [engine, resolution, fps]);

  if(!show){
    return null;
  }

  return (
    <>
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={onClose}>&times;</button>
      <h4 className={classes.title}>Video Export Settings</h4>
      <div className={classes.body}>
        <div className={classNames('paragraphSmall', classes.subtitle)}>
          Videos are exported with H.264 Codec
        </div>
        <SectionDivider />
        <Label
          label="Frames per Second"
          className={classes.fps}
          infoText={
            'FPS determines video smoothness. Higher FPS is smoother, but affects file size and export time.'
          }
        >
          <Select
            name="fps"
            value={fpsString}
            options={[
              { label: '24 FPS', value: '24' },
              { label: '30 FPS', value: '30' },
              { label: '60 FPS', value: '60' },
              { label: '120 FPS', value: '120' }
            ]}
            onChange={(val) => setFps(Number(val))}
          />
        </Label>

        <SectionDivider />
        <Resolution
          className={classes.resolution}
          onChange={setResolution}
          value={resolution}
          resolutions={ALL_RESOLUTIONS}
        />
      </div>

      <div className={classes.footer}>
        <progress className={classes.progress} value={progress} max={1} />
        <div className={classes.buttons}>
          <button
            className={'button button--small button--primary '}
            type="button"
            onClick={() => {
              handleVideoExport();
            }}
            disabled={progress > 0 || resolution.width > 3840}
          >
            <span>Export</span>
            {progress === 0 ? <DownloadIcon /> : <LoadingSpinnerIcon />}
          </button>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};
