import { useState, useCallback, useEffect } from 'react';

type Tile = {
    id: number;
    value: number;
    position: [number, number];
};

const GRID_SIZE = 4;

// Load saved game state from localStorage
const loadGameState = () => {
    const saved = localStorage.getItem('2048-game-state');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    return null;
};

// Save game state to localStorage
const saveGameState = (grid: (Tile | null)[][], score: number, gameOver: boolean) => {
    const state = { grid, score, gameOver };
    localStorage.setItem('2048-game-state', JSON.stringify(state));
};

export const use2048 = () => {
    const savedState = loadGameState();

    const [grid, setGrid] = useState<(Tile | null)[][]>(
        savedState?.grid || Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
    );
    const [score, setScore] = useState(savedState?.score || 0);
    const [bestScore, setBestScore] = useState(() => {
        return Number(localStorage.getItem('2048-best-score')) || 0;
    });
    const [gameOver, setGameOver] = useState(savedState?.gameOver || false);

    // Save state whenever grid, score, or gameOver changes
    useEffect(() => {
        if (grid.some(row => row.some(cell => cell !== null))) {
            saveGameState(grid, score, gameOver);
        }
    }, [grid, score, gameOver]);

    // Get all empty cells
    const getEmptyCells = (currentGrid: (Tile | null)[][]) => {
        const emptyCells: [number, number][] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!currentGrid[r][c]) {
                    emptyCells.push([r, c]);
                }
            }
        }
        return emptyCells;
    };

    // Add a random tile (90% chance of 2, 10% chance of 4)
    const addRandomTile = useCallback((currentGrid: (Tile | null)[][]) => {
        const emptyCells = getEmptyCells(currentGrid);
        if (emptyCells.length === 0) return currentGrid;

        const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newGrid = currentGrid.map(row => [...row]);

        newGrid[r][c] = {
            id: Date.now() + Math.random(),
            value: Math.random() < 0.9 ? 2 : 4, // 90% chance of 2
            position: [r, c],
        };

        return newGrid;
    }, []);

    // Initialize game with two random tiles (new game)
    const initGame = useCallback(() => {
        let newGrid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        localStorage.removeItem('2048-game-state'); // Clear saved state when starting new game
    }, [addRandomTile]);

    // Check if any moves are possible
    const canMove = (currentGrid: (Tile | null)[][]) => {
        // Check for empty cells
        if (getEmptyCells(currentGrid).length > 0) return true;

        // Check for possible merges horizontally
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 1; c++) {
                if (currentGrid[r][c] && currentGrid[r][c + 1] &&
                    currentGrid[r][c]!.value === currentGrid[r][c + 1]!.value) {
                    return true;
                }
            }
        }

        // Check for possible merges vertically
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 1; r++) {
                if (currentGrid[r][c] && currentGrid[r + 1][c] &&
                    currentGrid[r][c]!.value === currentGrid[r + 1][c]!.value) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * Process a single line (row or column) according to 2048 rules
     * Step 1: Slide (compress non-zero values)
     * Step 2: Merge (combine adjacent same values, only once per move)
     * Step 3: Slide again (compress after merge)
     */
    const processLine = (line: (Tile | null)[]): { newLine: (Tile | null)[], scoreGained: number } => {
        let scoreGained = 0;

        // Step 1: Slide - remove nulls and keep tiles
        let tiles = line.filter(tile => tile !== null) as Tile[];

        // Step 2: Merge - combine adjacent same values (from the direction of movement)
        const merged: Tile[] = [];
        let i = 0;
        while (i < tiles.length) {
            if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
                // Merge two tiles
                const mergedValue = tiles[i].value * 2;
                merged.push({
                    id: Date.now() + Math.random(),
                    value: mergedValue,
                    position: [0, 0], // Will be updated later
                });
                scoreGained += mergedValue;
                i += 2; // Skip both merged tiles
            } else {
                // No merge, keep tile as is
                merged.push(tiles[i]);
                i++;
            }
        }

        // Step 3: Slide again - fill remaining with nulls
        const newLine: (Tile | null)[] = [...merged];
        while (newLine.length < GRID_SIZE) {
            newLine.push(null);
        }

        return { newLine, scoreGained };
    };

    // Core move logic
    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        setGrid(prevGrid => {
            let newGrid = prevGrid.map(row => [...row]);
            let totalScoreGained = 0;
            let moved = false;

            if (direction === 'left') {
                // Process each row from left
                for (let r = 0; r < GRID_SIZE; r++) {
                    const { newLine, scoreGained } = processLine(newGrid[r]);

                    // Check if row changed
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (prevGrid[r][c]?.value !== newLine[c]?.value) {
                            moved = true;
                        }
                    }

                    newGrid[r] = newLine;
                    totalScoreGained += scoreGained;
                }
            } else if (direction === 'right') {
                // Process each row from right (reverse, process, reverse back)
                for (let r = 0; r < GRID_SIZE; r++) {
                    const reversed = [...newGrid[r]].reverse();
                    const { newLine, scoreGained } = processLine(reversed);

                    // Check if row changed
                    const finalLine = newLine.reverse();
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (prevGrid[r][c]?.value !== finalLine[c]?.value) {
                            moved = true;
                        }
                    }

                    newGrid[r] = finalLine;
                    totalScoreGained += scoreGained;
                }
            } else if (direction === 'up') {
                // Process each column from top
                for (let c = 0; c < GRID_SIZE; c++) {
                    const column = newGrid.map(row => row[c]);
                    const { newLine, scoreGained } = processLine(column);

                    // Check if column changed
                    for (let r = 0; r < GRID_SIZE; r++) {
                        if (prevGrid[r][c]?.value !== newLine[r]?.value) {
                            moved = true;
                        }
                        newGrid[r][c] = newLine[r];
                    }

                    totalScoreGained += scoreGained;
                }
            } else if (direction === 'down') {
                // Process each column from bottom (reverse, process, reverse back)
                for (let c = 0; c < GRID_SIZE; c++) {
                    const column = newGrid.map(row => row[c]);
                    const reversed = [...column].reverse();
                    const { newLine, scoreGained } = processLine(reversed);
                    const finalLine = newLine.reverse();

                    // Check if column changed
                    for (let r = 0; r < GRID_SIZE; r++) {
                        if (prevGrid[r][c]?.value !== finalLine[r]?.value) {
                            moved = true;
                        }
                        newGrid[r][c] = finalLine[r];
                    }

                    totalScoreGained += scoreGained;
                }
            }

            // Update tile positions
            newGrid = newGrid.map((row, r) =>
                row.map((tile, c) => tile ? { ...tile, position: [r, c] as [number, number] } : null)
            );

            // If grid changed, add a new tile and update score
            if (moved) {
                if (totalScoreGained > 0) {
                    setScore((s: number) => {
                        const newTotal = s + totalScoreGained;
                        if (newTotal > bestScore) {
                            setBestScore(newTotal);
                            localStorage.setItem('2048-best-score', newTotal.toString());
                        }
                        return newTotal;
                    });
                }

                const withNewTile = addRandomTile(newGrid);

                // Check if game is over
                if (!canMove(withNewTile)) {
                    setGameOver(true);
                }

                return withNewTile;
            }

            return prevGrid;
        });
    }, [gameOver, addRandomTile, bestScore]);

    // Only init game if no saved state exists
    useEffect(() => {
        if (!savedState) {
            initGame();
        }
    }, []); // Empty deps - only run once on mount

    return { grid, score, bestScore, move, initGame, gameOver };
};
