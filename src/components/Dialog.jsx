function Dialog({
  isOpen,
  dialogContent,
  btnOneText,
  btnTwoText,
  btnOneHandler,
  btnTwoHandler
}) {

  if(isOpen === false) {
    return null;
  }



  return (
    <div
      className="dialog-box-container"
      data-is_dialog_box_open={true}
    >
      <div className="dialog-box">
        <div className="dialog-content">
          {dialogContent}
        </div>

        <div className="dialog-btn-container">
          <button onClick={btnTwoHandler}>
            {btnTwoText}
          </button>
          <button onClick={btnOneHandler}>
            {btnOneText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;