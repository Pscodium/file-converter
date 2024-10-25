import { useImageConversor } from './ImageConversorContext';

const ConvertButton = () => {
    const { convertImage } = useImageConversor();

    return (
        <button onClick={convertImage} className='mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'>
            Converter Imagem
        </button>
    );
};

export default ConvertButton;
