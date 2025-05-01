import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type InputType = 'url' | 'input';

export interface ImageItem {
    id: string;
    inputContent: string;
    outputContent: string;
    fileName: string;
}

type ImageConversorContextType = {
    images: ImageItem[];
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    width: number;
    setWidth: React.Dispatch<React.SetStateAction<number>>;
    height: number;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
    inputFormat: string;
    setInputFormat: React.Dispatch<React.SetStateAction<string>>;
    inputType: InputType;
    setInputType: React.Dispatch<React.SetStateAction<InputType>>;
    outputFormat: string;
    setOutputFormat: React.Dispatch<React.SetStateAction<string>>;
    convertImages: () => void;
    addImageContent: (content: string, fileName: string) => void;
    removeImage: (id: string) => void;
    clearImages: () => void;
    isConverting: boolean;
};

const ImageConversorContext = createContext<ImageConversorContextType | undefined>(undefined);

export const useImageConversor = () => {
    const context = useContext(ImageConversorContext);
    if (!context) {
        throw new Error('useImageConversor deve ser usado dentro do ImageConversorContextProvider');
    }
    return context;
};

type RootProps = {
    children: ReactNode;
};

const availableFormats = ['svg', 'png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico'];

export const ImageConversorProvider = ({ children }: RootProps) => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [width, setWidth] = useState<number>(500);
    const [height, setHeight] = useState<number>(500);
    const [inputFormat, setInputFormat] = useState<string>('svg');
    const [inputType, setInputType] = useState<InputType>('input');
    const [outputFormat, setOutputFormat] = useState<string>('png');
    const [isConverting, setIsConverting] = useState<boolean>(false);

    const addImageContent = (content: string, fileName: string) => {
        console.log('Adding image content:', content, fileName);
        const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        setImages((prev) => [
            ...prev,
            {
                id: newId,
                inputContent: content,
                outputContent: '',
                fileName: fileName,
            },
        ]);
    };

    const clearImages = () => {
        setImages([]);
    };

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const convertImages = async () => {
        if (images.length === 0) return;

        setIsConverting(true);

        const updatedImages = [...images];

        for (let i = 0; i < updatedImages.length; i++) {
            if (!updatedImages[i].inputContent) continue;

            try {
                await new Promise<void>((resolve) => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                        canvas.width = width;
                        canvas.height = height;
                        ctx?.drawImage(img, 0, 0, width, height);
                        const convertedImage = canvas.toDataURL(`image/${outputFormat}`);
                        updatedImages[i].outputContent = convertedImage;
                        resolve();
                    };

                    img.onerror = () => {
                        console.error(`Failed to load image ${updatedImages[i].fileName}`);
                        resolve();
                    };

                    img.src = updatedImages[i].inputContent;
                });
            } catch (error) {
                console.error('Error converting image:', error);
            }
        }

        setImages(updatedImages);
        setIsConverting(false);
    };

    useEffect(() => {
        if (inputFormat === outputFormat) {
            const filteredFormats = availableFormats.filter((format) => format !== inputFormat && format !== 'svg');
            setOutputFormat(filteredFormats[0] || 'png');
        }
    }, [inputFormat]);

    return (
        <ImageConversorContext.Provider
            value={{
                images,
                setImages,
                width,
                setWidth,
                height,
                setHeight,
                inputFormat,
                setInputFormat,
                inputType,
                setInputType,
                outputFormat,
                setOutputFormat,
                convertImages,
                addImageContent,
                removeImage,
                clearImages,
                isConverting,
            }}
        >
            {children}
        </ImageConversorContext.Provider>
    );
};
