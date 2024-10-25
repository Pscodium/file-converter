import { InputType, useImageConversor } from './ImageConversorContext';

const ImageUploader = () => {
    const { setImageContent, setOutputUrl, inputType, setInputType, inputFormat, outputFormat, width, height } = useImageConversor();

    const handleImageUrl = (url: string) => {
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
                        setImageContent(pngDataUrl);
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
                    reader.onload = () => setImageContent(reader.result as string);
                    reader.readAsDataURL(blob);
                })
                .catch((error) => console.error('Erro ao carregar imagem', error));
        }
    };

    const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageContent(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleOpenInputType = (type: InputType) => {
        setImageContent('');
        setOutputUrl('');
        setInputType(type);
    };

    return (
        <div className='mb-4 flex flex-col gap-3'>
            <div className='w-full flex items-center justify-between h-10 rounded-md overflow-hidden bg-white'>
                <button onClick={() => handleOpenInputType('url')} className={`w-1/2 h-full font-bold ${inputType === 'url' ? 'bg-blue-600 text-white' : ''}`}>
                    URL
                </button>
                <button onClick={() => handleOpenInputType('input')} className={`w-1/2 h-full font-bold ${inputType === 'input' ? 'bg-blue-600 text-white' : ''}`}>
                    Input
                </button>
            </div>
            {inputType === 'url' && (
                <div>
                    <label className='block text-gray-700 mb-1'>Cole o link:</label>
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
                    <label className='block text-gray-700 mb-1'>Carregar Imagem:</label>
                    <input type='file' accept={`image/${inputFormat}`} onChange={handleImageFileUpload} className='flex w-full bg-white border border-gray-300 rounded-md shadow-sm p-1' />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
