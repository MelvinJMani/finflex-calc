import data from '../data/list_of_calculators.json';

const BOOKMARK_KEY = "finflex:favorites";

export const getCalculatorByName = (name: string) => {
    return data.find(calculator => calculator.link === name);
} 

// Utility functions to manage favorites in localStorage
export const toggleFavorite = (name: string): boolean => {
    try {
        const favorites = getFavorites();
        
        if (favorites.includes(name)) {
            // Remove the name if it's already a favorite
            const updatedFavorites = favorites.filter(fav => fav !== name);
            saveFavorites(updatedFavorites);
            return true;
        } else {
            // Add the name if it's not already a favorite
            favorites.push(name);
            saveFavorites(favorites);
            return true;
        }
    }catch(error){
        return false;
    }
}

export const isFavorite = (name: string): boolean => {
    const favorites = getFavorites();
    return favorites.includes(name);
}

// Helper functions

function getFavorites(): string[] {
    const storedFavorites = localStorage.getItem(BOOKMARK_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
}

function saveFavorites(favorites: string[]): void {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(favorites));
}