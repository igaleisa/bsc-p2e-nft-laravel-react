import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// core components
import Button from "@/components/CustomButtons/Button.js";

import defaultImage from "@/assets/img/image_placeholder.jpg";
import defaultAvatar from "@/assets/img/placeholder.jpg";

export default function ImageMultipleUpload(props) {
  const [files, setFiles] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    props.avatar ? defaultAvatar : defaultImage
  );
  let fileInput = React.createRef();
  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let files = e.target.files;
    reader.onloadend = () => {
      setFiles(files);
      setImagePreviewUrl(reader.result);
    };
    if (files) {
      reader.readAsDataURL(files[0]);
    }
    props.onChange(files);
  };
  // eslint-disable-next-line
  const handleSubmit = e => {
    e.preventDefault();
    // file is the file/image uploaded
    // in this function you can save the image (file) on form submit
    // you have to call it yourself
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFiles(null);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
    props.onChange(null);
  };
  let { avatar, addButtonProps, changeButtonProps, removeButtonProps } = props;
  return (
    <div className="fileinput text-center">
      <input type="file" onChange={handleImageChange} ref={fileInput} multiple />
      <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div>
        {files === null ? (
          <Button {...addButtonProps} onClick={() => handleClick()}>
            {avatar ? "Add Photo" : "Select image"}
          </Button>
        ) : (
          <span>            
            <Button {...changeButtonProps} onClick={() => handleClick()}>
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button {...removeButtonProps} onClick={() => handleRemove()}>
              <i className="fas fa-times" /> Remove
            </Button>
            {files.length ? (<br/>) : null}
            {files.length ? (<span>( {files.length} files )</span>) : null }
          </span>
        )}
      </div>
    </div>
  );
}

ImageMultipleUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object
};
