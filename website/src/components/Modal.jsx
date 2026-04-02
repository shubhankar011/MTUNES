export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative bg-[#1a1d23] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl">
                    <div className="flex justify-between items-center p-4 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
} 