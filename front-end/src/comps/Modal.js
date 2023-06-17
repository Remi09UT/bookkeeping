import React from "react";

export default function Modal({src, setImg}) {
    function handleClick(e) {
        if(e.target.classList.contains('backdrop')) {
            setImg(null);
        }
    }
    return (
        <div className="backdrop" onClick={handleClick}>
            <img src={src} alt="enlarged pic" />
        </div>
    )
}