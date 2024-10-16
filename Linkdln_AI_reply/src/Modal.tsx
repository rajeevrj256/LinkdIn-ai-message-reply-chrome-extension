import { useState } from "react";
import { FaArrowDown } from "react-icons/fa6";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { LuSendHorizonal } from "react-icons/lu";
import { getReply } from "./api"; // Adjust the import if necessary

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    if (isOpen) closeModal();
  };

  const handleGenerateReply = async () => {
    if (!userInput) return;

    setLoading(true);
    try {
      const reply = await getReply(userInput);
      setGeneratedResponse(reply);
      setIsGenerated(true);
    } catch (error) {
      console.error("Error generating reply:", error);
      setGeneratedResponse("An error occurred while generating the reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    closeModal();
    const textarea = document.querySelector(
      ".msg-form__contenteditable"
    ) as HTMLTextAreaElement;
    textarea.children[0].innerHTML = generatedResponse;
    setUserInput("");
    setGeneratedResponse("");
    setIsGenerated(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center align-center inset-0 bg-black/25"
          onClick={handleOverlayClick}
        >
          {!isGenerated ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center justify-center self-center bg-gray-50 p-5 w-[45rem] h-fit rounded-lg"
            >
              <input
                type="text"
                name="prompt"
                placeholder="Your prompt"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full focus:ring-0 focus:border-gray-300 border-gray-200 placeholder:text-gray-400 mb-6 text-gray-500 rounded-sm font-medium text-xl"
              />
              <button
                onClick={handleGenerateReply}
                disabled={!userInput || loading}
                className="flex items-center justify-around self-end bg-blue-500 text-white p-3 w-40 rounded-lg"
              >
                <LuSendHorizonal className="text-2xl" />
                <p className="text-xl font-medium">{loading ? 'Generating...' : 'Generate'}</p>
              </button>
            </div>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center justify-center self-center bg-gray-50 p-5 w-[45rem] h-fit rounded-lg gap-5"
            >
              <div className="flex flex-col gap-10 text-xl">
                <p className="p-3 text-slate-500 bg-slate-200 rounded-lg self-end w-[70%]">
                  {userInput}
                </p>
                <p className="p-3 text-slate-500 bg-blue-200 rounded-lg self-start w-[70%]">
                  {generatedResponse}
                </p>
              </div>
              <div className="flex items-center gap-5 self-end">
                <button
                  onClick={handleInsert}
                  className="flex items-center justify-around self-end bg-white text-gray-500 p-3 w-32 rounded-lg border border-gray-500"
                >
                  <FaArrowDown className="text-xl" />
                  <p className="text-xl font-medium">Insert</p>
                </button>
                <button
                  onClick={handleGenerateReply} // Reuse the generate function for regeneration
                  className="flex items-center justify-around self-end bg-blue-500 text-white p-3 w-40 rounded-lg"
                >
                  <HiArrowPathRoundedSquare className="text-xl" />
                  <p className="text-xl font-medium">{loading ? 'Regenerating...' : 'Regenerate'}</p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Modal;
