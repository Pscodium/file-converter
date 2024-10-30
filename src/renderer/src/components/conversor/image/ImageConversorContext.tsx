import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type InputType = 'url' | 'input';

type ImageConversorContextType = {
    imageContent: string;
    setImageContent: React.Dispatch<React.SetStateAction<string>>;
    outputUrl: string;
    setOutputUrl: React.Dispatch<React.SetStateAction<string>>;
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
    convertImage: () => void;
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
    const [imageContent, setImageContent] = useState<string>('');
    const [outputUrl, setOutputUrl] = useState<string>('');
    const [width, setWidth] = useState<number>(500);
    const [height, setHeight] = useState<number>(500);
    const [inputFormat, setInputFormat] = useState<string>('svg');
    const [inputType, setInputType] = useState<InputType>('input');
    const [outputFormat, setOutputFormat] = useState<string>('png');

    const convertImage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageContent;

        img.onload = () => {
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            const convertedImage = canvas.toDataURL(`image/${outputFormat}`);
            setOutputUrl(convertedImage);
        };
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
                imageContent,
                setImageContent,
                outputUrl,
                setOutputUrl,
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
                convertImage,
            }}
        >
            {children}
        </ImageConversorContext.Provider>
    );
};
