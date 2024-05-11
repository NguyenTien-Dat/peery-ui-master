import React from 'react';
import Modal from 'react-modal';


const ImageViewerModal = ({ isOpen, closeModal, imageURL }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Image Viewer"
            className="modal"
        >
            <div className="modal-content flex flex-col items-center justify-center mt-36">
                <img
                    src={imageURL}
                    alt="Proof"
                    style={{ maxWidth: '100%', maxHeight: '50vh', margin: 'auto', display: 'block' }}
                />
                <button
                    onClick={closeModal}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ImageViewerModal;
