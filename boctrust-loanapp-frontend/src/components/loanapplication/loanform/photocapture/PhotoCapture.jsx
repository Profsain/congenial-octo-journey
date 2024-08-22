// /* eslint-disable no-undef */
// import PropTypes from "prop-types";
// import Webcam from "react-webcam";
// import { useRef, useState, useCallback } from "react";
// import { AiOutlineCamera } from "react-icons/ai";
// import "./Photocapture.css";

// const PhotoCapture = ({ preFunction, func }) => {
//   const webcamRef = useRef(null);
//   const [imgSrc, setImgSrc] = useState(null);

//   // Create capture function
//   const capture = useCallback(() => {
//     preFunction();
//     const imageSrc = webcamRef.current.getScreenshot();
//     // const video = webcamRef.current.video;
//     // const canvas = document.createElement("canvas");
//     // canvas.width = video.videoWidth;
//     // canvas.height = video.videoHeight;
//     // const ctx = canvas.getContext("2d");
//     // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     // const imageSrc = canvas.toDataURL("image/jpeg", 0.8);
//     console.log(imageSrc, "imageSrc")
//     setImgSrc(imageSrc);
//     func(imageSrc);
//   }, [webcamRef]);

//   // Handle take photos container
//   const takePhotos = useCallback(() => {
//     const container = document.querySelector(".Container");
//     container.style.display = "none";
//     const captureContainer = document.querySelector(".CaptureContainer");
//     captureContainer.style.display = "block";
//   }, []);

//   // Handle retake function
//   const retake = useCallback(() => {
//     setImgSrc(null);
//   }, []);

//   return (
//     <>
//       <div className="Container" onClick={takePhotos}>
//         <AiOutlineCamera className="CameraIcon" />
//         <p className="Text">Take a Photo Now</p>
//       </div>

//       <div className="CaptureContainer">
//         {imgSrc ? (
//           <img src={imgSrc} alt="webcam" />
//         ) : (
//           <Webcam
//             height={280}
//             width={280}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             screenshotQuality={0.8}
//           />
//         )}
//         <div>
//           {imgSrc ? (
//             <div className="BtnCon">
//               <button className="CapBtn RetakeBtn" onClick={retake}>
//                 Retake
//               </button>
//             </div>
//           ) : (
//             <div className="BtnCont">
//               <button type="button" className="CapBtn" onClick={capture}>
//                 Capture
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// PhotoCapture.propTypes = {
//   func: PropTypes.func,
//   preFunction: PropTypes.func,
// };

// export default PhotoCapture;

import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import "./Photocapture.css";

const PhotoCapture = ({ func }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Create capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    func(imageSrc);
  }, [webcamRef]);

  // Handle take photos container
  const takePhotos = useCallback(() => {
    const container = document.querySelector(".Container");
    container.style.display = "none";
    const captureContainer = document.querySelector(".CaptureContainer");
    captureContainer.style.display = "block";
  }, []);

  // Handle retake function
  const retake = useCallback(() => {
    setImgSrc(null);
  }, []);

  return (
    <>
      <div className="Container" onClick={takePhotos}>
        <AiOutlineCamera className="CameraIcon" />
        <p className="Text">Take a Photo Now</p>
      </div>

      <div className="CaptureContainer">
        {imgSrc ? (
          <img src={imgSrc} alt="webcam" />
        ) : (
          <Webcam
            height={280}
            width={280}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
          />
        )}
        <div>
          {imgSrc ? (
            <div className="BtnCon">
              <button className="CapBtn RetakeBtn" onClick={retake}>
                Retake
              </button>
            </div>
          ) : (
            <div className="BtnCont">
              <button type="button" className="CapBtn" onClick={capture}>
                Capture
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

PhotoCapture.propTypes = {
  func: PropTypes.func,
};

export default PhotoCapture;
