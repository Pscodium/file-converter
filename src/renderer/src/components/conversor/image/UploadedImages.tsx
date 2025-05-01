import { useImageConversor } from './ImageConversorContext';
import { IoClose } from 'react-icons/io5';

const UploadedImages = () => {
    const { images, removeImage, clearImages } = useImageConversor();

    if (images.length === 0) {
        return null;
    }

    return (
        <div className='mb-6'>
            <div className='flex justify-between items-center mb-2'>
                <h3 className='text-gray-700 font-medium'>Imagens carregadas ({images.length})</h3>
                <button onClick={clearImages} className='text-sm text-red-600 hover:text-red-800'>
                    Remover todas
                </button>
            </div>

            <div className='flex flex-wrap gap-3'>
                {images.map((image) => (
                    <div key={image.id} className='relative border rounded-md overflow-hidden w-24 h-24 group'>
                        <img src={image.inputContent} alt={image.fileName} className='w-full h-full object-contain' />

                        <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                            <button onClick={() => removeImage(image.id)} className='p-1 bg-white rounded-full text-red-500 hover:bg-red-50' title='Remover imagem'>
                                <IoClose size={16} />
                            </button>
                        </div>

                        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1'>
                            <p className='text-white text-xs truncate text-center' title={image.fileName}>
                                {image.fileName.length > 12 ? image.fileName.substring(0, 10) + '...' : image.fileName}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadedImages;
