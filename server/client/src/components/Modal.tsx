import React from "react";
import ReactDOM from "react-dom";
import { ModalProps } from "./Searchbar";
//We use portals + modals instead of directly creating a component and use it
//inside the component tree structure because if a parent component
//uses position:relative; the z-index of all the child's component
// will be whatever the z-index of the parent component is; whhich can
//cause layout issues
const Modal: React.FC<ModalProps> = (props) => {
    return ReactDOM.createPortal(
        <div onClick={props.onDismiss} className="modal">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="modalBox"
            >
                <h2>{props.title}</h2>
                {props.content}
                {/*{props.actions} */}
            </div>
        </div>,
        //@ts-ignore
        document.querySelector("#modal")
    );
};
//When you click outside of the modal; histoyr.push() will be triggered.
//When clicking the modal box, history.push("/") will be triggered. But with
//e.stopProgataion(), we don't let the children bubble up to history.push()
//thus, we can now click the modal box without triggering history.push()
export default Modal;
