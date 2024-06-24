'use client';
import React, { useRef } from 'react';
import { UserInterfaceElements } from '@cesdk/cesdk-js';
import {
  PAGE_FORMATS_INSERT_ENTRY,
  formatAssetsToPresets,
  pageFormatI18n,
} from './PageFormatAssetLibrary';
import { ExportModal } from './ExportModal/ExportModal';

import { useState } from 'react';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import MOOD_ASSETS from './MoodBasedAssets.json';


import { createApplyFormatAsset } from './createApplyFormatAsset';
import CreativeEditor, { useConfig, useConfigure,useCreativeEditor } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';


const EMPTY_RESULT = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: undefined
};

const LABEL_BELOW_CARD_STYLE = {
  cardLabelStyle: () => ({
    height: '24px',
    color: '#fff',
    width: '72px',
    left: '4px',
    right: '4px',
    bottom: '-32px',
    padding: '0',
    background: 'transparent',
    overflow: 'hidden',
    textOverflow: 'unset',
    whiteSpace: 'unset',
    fontSize: '10px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    pointerEvents: 'none',
    pointer: 'default'
  }),
  cardStyle: () => ({
    
    height: '80px',
    width: '80px',
    marginBottom: '20px',
    overflow: 'visible'
  })
};



const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [showExportModal, setShowExportModal] = useState(false);
  const [chosenTheme, setChosenTheme] = useState('dark');
  const [scale, setScale] = useState('normal');
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [accentColor, setAccentColor] = useState(null);
  const creativeEditorRef = useRef(null);
  const handleOpenModal = () => {
    setShowExportModal(true);
  };

  const handleCloseModal = () => {
    setShowExportModal(false);
  };
  const useCustomTheme = !!backgroundColor || !!activeColor || !!accentColor;
  const calculatedTheme = useCustomTheme ? 'custom' : chosenTheme;
  const [exportURL, setExportUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const config = useConfig(
    () => ({
      theme: 'dark',
      role: 'Adopter',
      license: process.env.NEXT_PUBLIC_LICENSE,
      baseURL: '/assets',
      core: {
        // Specify location of core assets, required by the engine.
        baseURL: 'core/'
      },

      i18n: {
        en: {
          'libraries.ly.img.audio.ly.img.audio.label': 'Gemsounds',
          'libraries.ly.img.audio.ly.img.audio.Mood.label': 'Moods',
          'libraries.ly.img.audio.ly.img.audio.Mood/Upbeat.label': 'Upbeat',
          'libraries.ly.img.audio.ly.img.audio.Musician.label': 'Musician Contributed',
          'libraries.mood_based_source.label' : "Gemsound Moods",
          'libraries.pageSizes.facebook_reel.label': "Facebook Reel",
          'libraries.pageSizes.facebook_feed.label': "Facebook Feed",
          'libraries.pageSizes.facebook_story.label': "Facebook Story",
          'libraries.pageSizes.instagram_story.label': "Instagram Story",
          'libraries.pageSizes.instagram_reel.label': "Instagram Reel",
          'libraries.pageSizes.instagram_feed.label': "Instagram Feed",
          'libraries.pageSizes.tiktok.label': "Tiktok",
          'libraries.pageSizes.youtube.label': "Youtube",
          'libraries.pageSizes.general.label': "General",
          'libraries.pageSizes.igtv.label': "IGTV",
          ...pageFormatI18n(PAGE_FORMAT_ASSETS.assets),
          // 'libraries.ly.img.video.scene.label': 'Templates',
        },
      },
      ui: {
        pageFormats: formatAssetsToPresets(PAGE_FORMAT_ASSETS),
        scale: ({ containerWidth, isTouch }) => {
          if (containerWidth < 600 || isTouch) {
            return 'large';
          } else {
            return 'normal';
          }
        },
        elements: {
          view: 'default',
          panels: {
            settings: true,
          },
          dock: {
            groups: [
              {
                id: 'misc',
                entryIds: ['pageFormats'],
              },
              
              {
                id: 'ly.img.defaultGroup',
                
              }
            ],
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                const audioEntry = defaultEntries.find((entry) => {
                  return entry.id === "ly.img.audio" ;
                });
    
                // if (audioEntry) {
                //   audioEntry.previewBackgroundType = 'contain';
                //   audioEntry.gridBackgroundType = 'cover';
                //   audioEntry.previewLength= 3;
                //   audioEntry.gridColumns= 3;
                //   audioEntry.gridItemHeight= 'auto';
                //   audioEntry.title = (assetResult) => assetResult.title;
                //   audioEntry.cardLabel = (assetResult) => assetResult.label;
                //   audioEntry.cardStyle =  LABEL_BELOW_CARD_STYLE.cardStyle;
                  
                //   audioEntry.cardLabelStyle =  LABEL_BELOW_CARD_STYLE.cardLabelStyle;
                // }
                // const audios = (entry) => { return entry.id === "ly.img.audio" || entry.id === "mood_based_source"};
                // if(audios){
                  // audios.previewBackgroundType = 'contain';
                  // audios.gridBackgroundType = 'cover';
                  // audios.cardLabel =  (assetResult) => assetResult.label;
                  // audios.cardStyle =  LABEL_BELOW_CARD_STYLE.cardStyle;
                  // audios.cardLabelStyle =  LABEL_BELOW_CARD_STYLE.cardLabelStyle;
                // }
                return [
                  {
                    id:"gemsounds",
                    icon: 'http://localhost:3000/camvasbutton.png'
                  },
                  ...defaultEntries.filter(
                    (entry) => entry.id !== 'ly.img.template' && entry.id !== 'ly.img.video.template'
                  ),
                  {
                    id: 'ly.img.audio',
                    sourceIds: ['ly.img.audio','ly.img.audio.upload'],
                    
                    // cardLabel: (assetResult) => assetResult.label,
                    // cardLabel: (assetResult) => assetResult.label,
                    canAdd: (assetResult) => assetResult === 'ly.img.audio.upload'?true:false,
                    canRemove: (assetResult) => assetResult === 'ly.img.audio.upload'?true:false,
                    
                  },
                  PAGE_FORMATS_INSERT_ENTRY,
                  
                ];
              },
              floating:true
            },
          },

          navigation: {
            position: UserInterfaceElements.NavigationPosition.Top,
            action: {
              download: true,
              export: {
                show: true,
                format: ['video/mp4']
              },
              
              share : [
                {
                  label: 'Share', // string or i18n key
                  iconName: 'default', // one of 'default', 'download', 'upload', or 'save'
                  callback: () => {
                    // ShareButtons.init();
                    
                    
                  }
                }
              ]
            },
          },
        },
      },
      callbacks: {
        onUpload: 'local',
        onDownload: 'download',
        // onExport: 'download',
        onExport: 'download',
        onClear:async (blobs, options)=>{
          console.log(blobs);
        },
        onShare : async (blobs, options)=>{
          setShowExportModal(true);
          

        }
      },
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources({baseURL: 'http://localhost:3000/assets'});
    creativeEditorRef.current = instance;
    await instance.addDemoAssetSources({
      sceneMode: 'Video',
      baseURL: 'http://localhost:3000/assets/demo/v2',
      // We want to replace the demo audio assets with our own
      excludeAssetSourceIds: [
        'ly.img.audio',
        'ly.img.video.template',
        'ly.img.template',
        
        // 'ly.img.sticker',
      ],
    });

    const engine = instance.engine;
    engine.editor.setSettingBool('page/title/show', false);
    
    setCesdk(instance);

    loadAssetSourceFromContentJSON(
      engine,
      MOOD_ASSETS,
      caseAssetPath('/audio/moods_based')
    );
    // loadAssetSourceFromContentJSON(
    //   engine,
    //   MOOD_BASED_ASSETS,
    //   createApplyFormatAsset(engine)
    // );
    // loadAssetSourceFromContentJSON(
    //   engine,
    //   MUSICIAN_CONTRIBUTED_ASSETS,
    //   caseAssetPath('/audio/musician_contributed')
    // );

    loadAssetSourceFromContentJSON(
      engine,
      PAGE_FORMAT_ASSETS,
      caseAssetPath('/page-formats'),
      createApplyFormatAsset(engine)
    );


    // loadAssetSourceFromContentJSON(
    //   engine,
    //   VIDEO_SCENES_ASSETS,
    //   caseAssetPath('/templates'),
    //   async (asset) => {
    //     if (!asset.meta || !asset.meta.uri)
    //       throw new Error('Asset does not have a uri');
    //     await engine.scene.loadFromURL(asset.meta.uri);
    //     persistSelectedTemplateToURL(asset.id);
    //   }
    // );
    
    await instance.createVideoScene();
    
      // .loadFromURL(
      //   caseAssetPath(`/templates/${loadSelectedTemplateFromURL()}.scene`)
      // )
      // .catch(() => {
      //   // Fallback to motion template if the selected template fails to load, e.g due to 404
      //   instance.loadFromURL(caseAssetPath(`/templates/motion.scene`));
      // });

      // CAMERA CODE
      // navigator.mediaDevices.getUserMedia({ video: true }).then(
      //   (stream) => {
      //     const video = document.createElement('video');
      //     video.autoplay = true;
      //     video.srcObject = stream;
      //     video.addEventListener('loadedmetadata', () => {
      //       engine.block.setWidth(page, video.videoWidth);
      //       engine.block.setHeight(page, video.videoHeight);
      //       engine.scene.zoomToBlock(page, 40, 40, 40, 40);
      //       const onVideoFrame = () => {
      //         engine.block.setNativePixelBuffer(pixelStreamFill, video);
      //         video.requestVideoFrameCallback(onVideoFrame);
      //       };
      //       video.requestVideoFrameCallback(onVideoFrame);
      //     });
      //   },
      //   (err) => {
      //     console.error(err);
      //   }
      // );
      
  }, []);
  
  
  return (
    <div style={cesdkWrapperStyle}>
      <CreativeEditor
        style={cesdkStyle}
        config={config}
        configure={configure}
        
      />
      
      {
        cesdk && <div style={modalStyle}><ExportModal 
        show={showExportModal} 
        onClose={handleCloseModal} 
        engine={cesdk.engine} 
      /></div>
      }
       {
        document.addEventListener("DOMContentLoaded", function() {
          // Select the button element
          const button = document.querySelector('button[name="expand-timeline"]');
          
          if (button) {
            button.click();
          } else {
            console.error("Button element not found!");
          }
        })
       }
    </div>
  );
};

const modalStyle = {
  display: 'flex',
  overflow: 'hidden',
  /* Min height ensures that no layout jumps happen */
  minHeight: '670px',
  flexBasis: '330px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  background: '#fafafa',
  boxShadow:
    '0px 0px 2px rgba(18, 26, 33, 0.25), 0px 6px 6px -2px rgba(18, 26, 33, 0.12), 0px 2.5px 2.5px -2px rgba(18, 26, 33, 0.12), 0px 1.25px 1.25px -2px rgba(18, 26, 33, 0.12)',
  borderRadius: '12px'
};


function persistSelectedTemplateToURL(templateName) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', templateName);
  window.history.pushState({}, '', url);
}
function loadSelectedTemplateFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get('template') || 'motion';
}

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const cesdkWrapperStyle = {
  position: 'relative',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)',
  minHeight: '740px',
};

export default CaseComponent;
