# Website
This is a repository with some `html`/`js`/`css` files for my personal website hosted at http://maksim1744.ru

## Subpages
### [Chimp test](http://maksim1744.ru/chimp)
Title comes from [this](https://www.youtube.com/watch?v=zsXP8qeFF6A) video.
You need to remember positions of all numbers and then click them in order starting from 1.
In comparison with other similar online tests, here you can set any size of the field and any number of hidden cells.
Written completely in `js`.
### [Tic-tac-toe](http://maksim1744.ru/ttt)
A modification of tic-tac-toe inspired by [this video](https://www.reddit.com/r/nextfuckinglevel/comments/nkupcu/upgraded_tic_tac_toe/).
You need to win by making a row or a column or a diagonal with circles of your color.
Compared to standard tic-tac-toe, you can cover smaller circles with larger ones.

Spoiler &mdash; with optimal strategy this game ends in a draw.
So additionally there is a version where computer makes random moves, then it's pretty easy to win.
But you can always enable optimal strategy after first couple of moves and try winning from there.

Backend is written in rust and located [here](https://github.com/maksim1744/tic-tac-toe).
It mainly just tells the best move for any given position, and you can send some requests yourself to `/api/ttt`
(right now you will have to guess format based on queries, which [ttt.js](/ttt.js#L60) makes).

## Issues
- Touch support is currently either bad (in *chimp* horizontal centering is broken in portrait mode for some reason), or completely nonexistent (drag-and-drop in *tic-tac-toe*)

Any contribution is welcome (especially in `html`/`js`/`css`)
