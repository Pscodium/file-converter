import { useState } from 'react';
import { useImageConversor } from './ImageConversorContext';
import { IoCheckmarkCircle, IoDownload, IoArchive } from 'react-icons/io5';
import JSZip from 'jszip';

const ImageConverted = () => {
    const { images, outputFormat } = useImageConversor();
    const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>({});
    const [isZipping, setIsZipping] = useState(false);

    const convertedImages = images.filter((img) => img.outputContent);

    if (convertedImages.length === 0) {
        return null;
    }

    const toggleSelectImage = (id: string) => {
        setSelectedImages((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const selectAllImages = () => {
        const allSelected = convertedImages.every((img) => selectedImages[img.id]);

        if (allSelected) {
            setSelectedImages({});
        } else {
            const newSelection: Record<string, boolean> = {};
            convertedImages.forEach((img) => {
                newSelection[img.id] = true;
            });
            setSelectedImages(newSelection);
        }
    };

    const dataURLtoBlob = (dataURL: string): Blob => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    const downloadImage = (dataUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName.split('.')[0]}.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadSelectedImagesAsZip = async () => {
        const selectedIds = Object.entries(selectedImages)
            .filter(([, selected]) => selected)
            .map(([id]) => id);

        if (selectedIds.length === 0) return;

        setIsZipping(true);

        try {
            const zip = new JSZip();

            selectedIds.forEach((id) => {
                const image = convertedImages.find((img) => img.id === id);
                if (image) {
                    const blob = dataURLtoBlob(image.outputContent);
                    zip.file(`${image.fileName.split('.')[0]}.${outputFormat}`, blob);
                }
            });

            const zipContent = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipContent);

            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = `imagens_convertidas_${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(zipUrl);
        } catch (error) {
            console.error('Erro ao criar arquivo ZIP:', error);
            alert('Ocorreu um erro ao criar o arquivo ZIP. Por favor, tente novamente.');
        }

        setIsZipping(false);
    };

    const downloadAllImagesAsZip = async () => {
        if (convertedImages.length === 0) return;

        setIsZipping(true);

        try {
            const zip = new JSZip();

            convertedImages.forEach((image) => {
                const blob = dataURLtoBlob(image.outputContent);
                zip.file(`${image.fileName.split('.')[0]}.${outputFormat}`, blob);
            });

            const zipContent = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipContent);

            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = `imagens_convertidas_${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(zipUrl);
        } catch (error) {
            console.error('Erro ao criar arquivo ZIP:', error);
            alert('Ocorreu um erro ao criar o arquivo ZIP. Por favor, tente novamente.');
        }

        setIsZipping(false);
    };

    const hasSelectedImages = Object.values(selectedImages).some((selected) => selected);

    if (convertedImages.length === 1) {
        const image = convertedImages[0];
        return (
            <div className='mt-6 bg-white p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-medium text-gray-800 mb-3'>Imagem Convertida:</h3>
                <div className='border rounded-md overflow-hidden'>
                    <img src={image.outputContent} alt='Imagem Convertida' className='w-full object-contain max-h-64' />
                </div>
                <button
                    onClick={() => downloadImage(image.outputContent, image.fileName)}
                    className='mt-3 flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                >
                    <IoDownload className='mr-2' />
                    Baixar Imagem
                </button>
            </div>
        );
    }

    // Multiple images display
    return (
        <div className='mt-6 bg-white p-4 rounded-lg shadow-sm'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
                <h3 className='text-lg font-medium text-gray-800'>Imagens Convertidas ({convertedImages.length})</h3>
                <div className='flex flex-wrap gap-2'>
                    <button onClick={selectAllImages} className='py-1 px-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition'>
                        {convertedImages.every((img) => selectedImages[img.id]) ? 'Desselecionar todos' : 'Selecionar todos'}
                    </button>

                    {hasSelectedImages && (
                        <button
                            onClick={downloadSelectedImagesAsZip}
                            disabled={isZipping}
                            className='py-1 px-3 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200 transition flex items-center disabled:opacity-70 disabled:cursor-not-allowed'
                        >
                            {isZipping ? (
                                <>
                                    <svg className='animate-spin -ml-1 mr-1 h-4 w-4 text-blue-700' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    Compactando...
                                </>
                            ) : (
                                <>
                                    <IoArchive className='mr-1' size={14} />
                                    Baixar selecionados
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={downloadAllImagesAsZip}
                        disabled={isZipping}
                        className='py-1 px-3 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {isZipping ? (
                            <>
                                <svg className='animate-spin -ml-1 mr-1 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    ></path>
                                </svg>
                                Compactando...
                            </>
                        ) : (
                            <>
                                <IoArchive className='mr-1' size={14} />
                                Baixar todos (ZIP)
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {convertedImages.map((image) => (
                    <div
                        key={image.id}
                        className={`
                            relative border rounded-md overflow-hidden hover:shadow-md transition cursor-pointer
                            ${selectedImages[image.id] ? 'ring-2 ring-blue-500' : ''}
                        `}
                        onClick={() => toggleSelectImage(image.id)}
                    >
                        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
                            <img src={image.outputContent} alt={image.fileName} className='max-w-full max-h-full object-contain' />
                        </div>

                        <div className='p-2 flex justify-between items-center bg-gray-50'>
                            <div className='truncate text-sm text-gray-700' title={image.fileName}>
                                {image.fileName.split('.')[0]}.{outputFormat}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadImage(image.outputContent, image.fileName);
                                }}
                                className='p-1 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50'
                                title='Baixar imagem'
                            >
                                <IoDownload size={18} />
                            </button>
                        </div>

                        {selectedImages[image.id] && (
                            <div className='absolute top-2 right-2'>
                                <IoCheckmarkCircle className='text-blue-500 text-xl' />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageConverted;
