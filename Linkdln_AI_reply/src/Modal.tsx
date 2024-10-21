import { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa6";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { LuSendHorizonal } from "react-icons/lu";
import { getReply } from "./api";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [regenerateInput, setRegenerateInput] = useState("");
  const [response, setResponse] = useState<string | null>(null); // Adjusted to store string
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGenerated) {
      setIsLoading(true);
      setError(null); // Reset error state
      getReply(userInput)
        .then((data) => {
          // Assuming data is { reply: string }
          setResponse(data); // Directly setting reply string
        })
        .catch(() => {
          setError("Failed to generate reply. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isGenerated]);

  const closeModal = () => {
    setIsOpen(false);
    setUserInput(""); // Clear user input on close
    setRegenerateInput(""); // Clear regenerate input on close
    setResponse(null); // Reset response on close
    setIsGenerated(false); // Reset generated state
  };

  const handleOverlayClick = () => {
    if (isOpen) closeModal();
  };

  const handleInsert = () => {
    closeModal();
    const textarea = document.querySelector(
      ".msg-form__contenteditable"
    ) as HTMLTextAreaElement;

    if (textarea && response) {
      if(textarea.innerText!==""){
        textarea.innerText="";
      }
      const placeholder = document.querySelector(
        ".msg-form__placeholder"
      );
    
      if (placeholder) {
        placeholder.remove(); // Remove the placeholder div
      }
      textarea.innerText = response.replace(/"/g, ''); // Update value directly
      textarea.removeAttribute('aria-label');
    }
  };

  const handleRegenerate = () => {
    const inputToUse = regenerateInput || userInput;
    if (inputToUse) {
      setIsLoading(true);
      setError(null); // Reset error state
      getReply(regenerateInput)
        .then((data) => {
          setResponse(data); // Directly setting reply string
          setRegenerateInput(""); // Clear the regenerate input field
        })
        .catch(() => {
          setError("Failed to regenerate reply. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center align-center inset-0 bg-black/25"
          onClick={handleOverlayClick}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center self-center bg-gray-50 p-5 w-[45rem] h-fit rounded-lg"
          >
            {!isGenerated ? (
              <>
                <input
                  type="text"
                  name="prompt"
                  placeholder="Your prompt"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full focus:ring-0 focus:border-gray-300 border-gray-200 placeholder:text-gray-400 mb-6 text-gray-500 rounded-sm font-medium text-xl"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                  onClick={() => {
                    setIsGenerated(true);
                  }}
                  disabled={!userInput || isLoading}
                  className="flex items-center justify-around self-end bg-blue-500 text-white p-3 w-40 rounded-lg"
                >
                  <LuSendHorizonal className="text-2xl" />
                  <p className="text-xl font-medium">Generate</p>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-10 text-xl">
                  <p className="p-3 text-slate-500 bg-slate-200 rounded-lg self-end w-[70%]">
                    {userInput}
                  </p>
                  {isLoading ? (
                    <p className="p-3 text-slate-500 bg-blue-200 rounded-lg self-start w-[70%]">
                      Generating response...
                    </p>
                  ) : (
                    response && (
                      <p className="p-3 text-slate-500 bg-blue-200 rounded-lg self-start w-[70%]">
                        {response.replace(/"/g, '')}
                      </p>
                    )
                  )}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <input
                  type="text"
                  name="prompt"
                  placeholder="Your prompt"
                  value={regenerateInput}
                  onChange={(e) => setRegenerateInput(e.target.value)}
                  className="w-full focus:ring-0 focus:border-gray-300 border-gray-200 placeholder:text-gray-400 mb-6 text-gray-500 rounded-sm font-medium text-xl"
                />
                <div className="flex items-center gap-5 self-end">
                  <button
                    onClick={handleInsert}
                    className="flex items-center justify-around self-end bg-white text-gray-500 p-3 w-32 rounded-lg border border-gray-500"
                  >
                    <FaArrowDown className="text-xl" />
                    <p className="text-xl font-medium">Insert</p>
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={!regenerateInput || isLoading}
                    className="flex items-center justify-around self-end bg-blue-500 text-white p-3 w-40 rounded-lg"
                  >
                    <HiArrowPathRoundedSquare className="text-xl" />
                    <p className="text-xl font-medium">Regenerate</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal; 