import React, { useState } from 'react';

const App = () => {
    const [word, setWord] = useState('');
    const [result, setResult] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWordData = async () => {
        if (word.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (!response.ok) throw new Error('Word not found');
                const data = await response.json();
                setResult(data[0]);
                setSuggestions([]);
            } catch (error) {
                setResult({ error: error.message });
                fetchSuggestions();
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
            const data = await response.json();
            setSuggestions(data.map((item) => item.word));
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
            {/* Hero Section */}
            <header className="bg-gray-800 text-center py-12 px-4">
                <h1 className="text-4xl font-extrabold text-blue-400">Your Dictionary!!</h1>
                <p className="text-lg mt-2 text-gray-300">
                    Explore meanings, phonetics, and word suggestions effortlessly!
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-full sm:w-3/4 max-w-lg p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchWordData}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition w-full sm:w-auto"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </header>

            {/* Result Section */}
            <section className="py-12 bg-gray-900 px-4">
                <div className="max-w-3xl mx-auto">
                    {result ? (
                        result.error ? (
                            <>
                                <p className="text-red-500 text-center font-medium">{result.error}</p>
                                {suggestions.length > 0 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-gray-300">Did you mean:</p>
                                        <ul className="list-none flex flex-wrap justify-center mt-2 gap-2">
                                            {suggestions.map((suggestion) => (
                                                <li
                                                    key={suggestion}
                                                    className="cursor-pointer bg-gray-700 text-blue-400 px-4 py-2 rounded-lg shadow hover:bg-gray-600"
                                                    onClick={() => {
                                                        setWord(suggestion);
                                                        setResult(null);
                                                        fetchWordData();
                                                    }}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-bold text-blue-400 mb-2">{result.word}</h2>
                                <p className="text-gray-300">
                                    <strong>Part of Speech:</strong> {result.meanings[0]?.partOfSpeech || 'N/A'}
                                </p>
                                <p className="text-gray-300">
                                    <strong>Definition:</strong>{' '}
                                    {result.meanings[0]?.definitions[0]?.definition || 'N/A'}
                                </p>
                                {result.phonetics[0]?.audio && (
                                    <div className="mt-4">
                                        <audio controls className="w-full">
                                            <source src={result.phonetics[0].audio} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <p className="text-gray-400 text-center">Search for a word to see its definition.</p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-4 text-center">
                <p className="text-sm">© 2024 Dictionary App. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default App;
