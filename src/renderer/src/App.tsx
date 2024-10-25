import { useEffect, useState } from 'react';
import { Window } from './components/window';
import ImageConversor from './components/conversor/image/ImageConversor';

export default function App() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Window.Root className='flex flex-col items-center'>
            <Window.Header className='fixed drag shadow-sm flex bg-gray-200 w-full h-7 items-center' />
            <Window.Content className='overflow-auto mt-7 w-full items-center bg-gray-100' style={{ height: windowHeight - 30 }}>
                <ImageConversor />
            </Window.Content>
        </Window.Root>
    );
}
