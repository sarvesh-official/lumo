'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Button } from './ui/button';

interface Card {
  question: string;
  answer: string;
}

interface FlashcardPanelProps {
  chatId: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface FlashcardPanelRef {
  refresh: () => Promise<void>;
  hasCards: boolean;
}

export const FlashcardPanel = forwardRef<FlashcardPanelRef, FlashcardPanelProps>(({ chatId, isOpen, onClose }, ref) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlashcards = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/flashcards/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
      }
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useImperativeHandle(ref, () => ({
    refresh: fetchFlashcards,
    hasCards: cards.length > 0
  }), [fetchFlashcards, cards.length]);

  useEffect(() => {
    if (isOpen && chatId) {
      fetchFlashcards();
    }
  }, [isOpen, chatId, fetchFlashcards]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '400px', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-l bg-background overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Flashcards</h3>
          {cards.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} / {cards.length}
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading flashcards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="mb-2">No flashcards yet</p>
            <p className="text-sm">Ask me to create flashcards from our conversation!</p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <div
              className="relative w-full h-64 cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full bg-card border-2 border-primary rounded-lg p-6 flex flex-col items-center justify-center shadow-lg">
                    <p className="text-xs text-muted-foreground mb-2">Question</p>
                    <p className="text-center font-medium">
                      {cards[currentIndex]?.question}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="w-full h-full bg-primary text-primary-foreground border-2 border-primary rounded-lg p-6 flex flex-col items-center justify-center shadow-lg">
                    <p className="text-xs opacity-80 mb-2">Answer</p>
                    <p className="text-center font-medium">
                      {cards[currentIndex]?.answer}
                    </p>
                    <p className="text-xs opacity-80 mt-4">Click to flip</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={cards.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShuffle}
                disabled={cards.length <= 1}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={cards.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});
