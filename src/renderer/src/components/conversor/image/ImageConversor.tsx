import { ImageConversorProvider } from './ImageConversorContext';
import FormatSelector from './FormatSelector';
import FormatOutputSelector from './FormatOutputSelector';
import SizeControl from './SizeControl';
import ImageUploader from './ImageUploader';
import ConvertButton from './ConvertButton';
import ImageConverted from './ImageConverted';
import UploadedImages from './UploadedImages';

const ImageConversor = () => {
    return (
        <ImageConversorProvider>
            <div className='p-6 max-w-4xl mx-auto'>
                <h1 className='text-3xl font-bold mt-6 mb-6 text-center text-gray-800'>Conversor de Imagens</h1>

                <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                    <ImageUploader />

                    <UploadedImages />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2'>
                        <FormatSelector />
                        <FormatOutputSelector />
                    </div>

                    <SizeControl />

                    <div className='flex justify-center'>
                        <ConvertButton />
                    </div>
                </div>

                <ImageConverted />
            </div>
        </ImageConversorProvider>
    );
};

export default ImageConversor;
