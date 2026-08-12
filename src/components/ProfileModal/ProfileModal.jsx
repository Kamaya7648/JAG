import "./ProfileModal.css";
import { useState, useRef } from "react";
import { FaPen, FaTimes } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

function ProfileModal({ onClose }) {
  const { user, setUser } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const fileInputRef = useRef(null);

  const handlePickImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });
    }
  };

  const saveName = () => {
    if (nameInput.trim() !== "") {
      setUser({ ...user, name: nameInput.trim() });
    }
    setEditingName(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-image-wrapper">
          <img src={user.image} alt={user.name} />

          <button className="modal-edit-icon" onClick={handlePickImage}>
            <FaPen />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <div className="modal-name-row">
          {editingName ? (
            <input
              className="modal-name-input"
              value={nameInput}
              autoFocus
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
            />
          ) : (
            <>
              <h2>{user.name}</h2>
              <button className="modal-edit-name" onClick={() => setEditingName(true)}>
                <FaPen />
              </button>
            </>
          )}
        </div>

        <p>{user.role}</p>

      </div>
    </div>
  );
}

export default ProfileModal;