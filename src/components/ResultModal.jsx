import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const ResultModal = forwardRef(function ResultModal(
    { result, targetTime, remainingTime, onReset },
    ref
) {
    const dialog = useRef();

    const userLost = remainingTime <= 0;
    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
    const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
        };
    });

    // render the modal in different dom node other than the one in which it was called (Timer Challange (challanges div))
    return createPortal(
        <dialog ref={dialog} className="result-modal">
            {userLost && <h2>you lost</h2>}
            {!userLost && <h2>you score: {score}</h2>}
            <p>
                target time was <strong>{targetTime} seconds.</strong>
            </p>
            <p>
                you stopped the timer with{" "}
                <strong>{formattedRemainingTime} seconds left.</strong>
            </p>

            <form method="dialog" onSubmit={onReset}>
                <button>close</button>
            </form>
        </dialog>,
        document.getElementById("modal")
    );
});

export default ResultModal;
