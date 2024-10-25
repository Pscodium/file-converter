import { ImageConversorProvider } from './ImageConversorContext';
import FormatSelector from './FormatSelector';
import FormatOutputSelector from './FormatOutputSelector';
import SizeControl from './SizeControl';
import ImageUploader from './ImageUploader';
import ConvertButton from './ConvertButton';
import ImageConverted from './ImageConverted';

const ImageConversor = () => {
    return (
        <ImageConversorProvider>
            <div className='p-8'>
                <h1 className='text-3xl font-bold mt-10 mb-6 text-center'>Conversor de Imagens</h1>
                <div className='max-w-md mx-auto'>
                    <ImageUploader />
                    <FormatSelector />
                    <FormatOutputSelector />
                    <SizeControl />
                    <ConvertButton />
                    <ImageConverted />
                </div>
            </div>
        </ImageConversorProvider>
    );
};

export default ImageConversor;
