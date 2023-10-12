import React from "react";

const ErrorModal = ({
  onOkClick,
  show,
}: {
  show: string;
  onOkClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  if (!Boolean(show)) return undefined;
  return (
    <dialog
      className={`modal ${Boolean(show) ? "modal-open" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="prose modal-box w-11/12 max-w-5xl">
        <div className="flex items-center space-x-3">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h3 className="m-0 p-0">An error has occurred.</h3>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-500">
            The operation was not successful.
          </p>
          <p className="mb-2 mt-4 border-b-2 text-sm font-bold text-gray-900">
            Error Message
          </p>
          <div className="w-max-full max-h-[400px] w-full overflow-scroll whitespace-pre-wrap">
            {show}
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog" className="space-x-2">
            <button type="button" onClick={onOkClick} className="btn">
              Ok
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ErrorModal;
