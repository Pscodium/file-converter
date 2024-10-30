import { useImageConversor } from './ImageConversorContext';

const ImageConverted = () => {
    const { outputUrl, outputFormat } = useImageConversor();

    console.log('entra aqui ', outputFormat);

    return outputUrl ? (
        <div className='mt-4'>
            <h3 className='text-gray-700'>Imagem Convertida:</h3>
            <img src={outputUrl} alt='Imagem Convertida' className='max-w-full border border-gray-300 rounded-md shadow-sm' />
            <a href={outputUrl} download={`${Date.now()}.${outputFormat}`} className='block mt-2 text-blue-600 hover:text-blue-800 underline'>
                Baixar Imagem
            </a>
        </div>
    ) : null;
};

export default ImageConverted;
