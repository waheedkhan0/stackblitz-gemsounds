import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const SharePopup = ({ onShare }) => (
    <Popup
      trigger={<button className="button"> Share </button>}
      modal
      nested
    >
      {close => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Share your creation </div>
          <div className="content">
            <button onClick={() => onShare('instagram')}>Share to Instagram</button>
            <button onClick={() => onShare('facebook')}>Share to Facebook</button>
            <button onClick={() => onShare('youtube')}>Share to YouTube</button>
            <button onClick={() => onShare('tiktok')}>Share to TikTok</button>
          </div>
        </div>
      )}
    </Popup>
  );

  export default SharePopup;