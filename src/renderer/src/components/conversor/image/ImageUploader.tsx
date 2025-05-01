import { useRef } from 'react';
import { InputType, useImageConversor } from './ImageConversorContext';
import { IoCloudUploadOutline } from 'react-icons/io5';

const ImageUploader = () => {
    const { addImageContent, clearImages, inputType, setInputType, inputFormat, outputFormat, width, height } = useImageConversor();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUrl = (url: string) => {
        if (!url.trim()) return;

        const fileName = url.split('/').pop() || 'image-from-url';

        if (inputFormat.toLowerCase() === 'svg') {
            fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/proxy?url=${encodeURIComponent(url)}`)
                .then((response) => response.blob())
                .then((svgContent) => {
                    const img = new Image();
                    const svgBlob = new Blob([svgContent], { type: svgContent.type });
                    const objectUrl = URL.createObjectURL(svgBlob);

                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);

                        const pngDataUrl = canvas.toDataURL(`image/${outputFormat}`);
                        addImageContent(pngDataUrl, fileName);
                        URL.revokeObjectURL(objectUrl);
                    };

                    img.src = objectUrl;
                })
                .catch((error) => console.error('Erro ao carregar imagem', error));
        } else {
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => addImageContent(reader.result as string, fileName);
                    reader.readAsDataURL(blob);
                })
                .catch((error) => console.error('Erro ao carregar imagem', error));
        }
    };

    const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        clearImages();

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    addImageContent(e.target.result as string, file.name);
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenInputType = (type: InputType) => {
        clearImages();
        setInputType(type);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            clearImages();
            Array.from(e.dataTransfer.files).forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target?.result) {
                            addImageContent(e.target.result as string, file.name);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className='mb-6 flex flex-col gap-3'>
            <div className='w-full flex items-center justify-between h-10 rounded-md overflow-hidden bg-white'>
                <button onClick={() => handleOpenInputType('url')} className={`w-1/2 h-full font-bold ${inputType === 'url' ? 'bg-blue-600 text-white' : ''}`}>
                    URL
                </button>
                <button onClick={() => handleOpenInputType('input')} className={`w-1/2 h-full font-bold ${inputType === 'input' ? 'bg-blue-600 text-white' : ''}`}>
                    Arquivo
                </button>
            </div>

            {inputType === 'url' && (
                <div>
                    <label className='block text-gray-700 mb-1'>Cole o link da imagem:</label>
                    <input
                        type='text'
                        placeholder='Insira o URL da imagem'
                        onBlur={(e) => handleImageUrl(e.target.value)}
                        className='flex w-full bg-white border border-gray-300 rounded-md shadow-sm p-[7px]'
                    />
                </div>
            )}

            {inputType === 'input' && (
                <div>
                    <div
                        className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:bg-gray-50 cursor-pointer transition'
                        onClick={triggerFileInput}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <IoCloudUploadOutline className='text-4xl text-blue-500 mb-2' />
                        <p className='text-gray-600 font-medium'>Arraste e solte arquivos aqui ou clique para selecionar</p>
                        <p className='text-gray-400 text-sm mt-1'>Suporta múltiplos arquivos</p>
                        <input ref={fileInputRef} type='file' accept={`image/*`} onChange={handleImageFileUpload} className='hidden' multiple />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
