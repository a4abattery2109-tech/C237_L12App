const express = require('express')

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

let items = [
    { id: 1, type: 'Kanji', level: 'N4', japanese: '行', pronunciation: 'いく', meaning: 'Go', example: '私は学校に行きます。/ I go to school' },
    { id: 2, type: 'Grammar', level: 'N3', japanese: 'あまり', pronunciation: 'あまり', meaning: 'so much ... that', example: 'あまり難しくありません。/ Not too difficult' },
    { id: 3, type: 'Vocab', level: 'N5', japanese: '金曜日', pronunciation: 'きんようび', meaning: 'Friday', example: '金曜日に友達に会います。/ I will meet my friends on Friday' },
    { id: 4, type: 'Kanji', level: 'N5', japanese: '一', pronunciation: 'いち', meaning: 'One', example: '一番好きです。/ I like it the most' },
    { id: 5, type: 'Kanji', level: 'N4', japanese: '校', pronunciation: 'こう', meaning: 'School', example: '学校に行く。/ Go to school' },
]

app.get('/', (req, res) => {
    res.render('index', { items });
});

app.get('/items/create', (req, res) => {
    res.render('addItem');
});

app.post('/items', (req, res) => {
    const { type, level, japanese, meaning, pronunciation, example } = req.body;
    const nextId = items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const newItem = {
        id: nextId,
        type: type || 'Unknown',
        level: level || 'Unknown',
        japanese: japanese || '',
        pronunciation: pronunciation || '',
        meaning: meaning || '',
        example: example || ''
    };
    items.push(newItem);
    res.redirect('/');
});

app.get('/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).send('Item not found');
    res.render('itemInfo', { item });
});

app.get('/items/:id/update', (req, res) => {
    const id = Number(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).send('Item not found');
    res.render('updateItem', { item });
});

app.post('/items/:id/update', (req, res) => {
    const id = Number(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).send('Item not found');

    const { type, level, japanese, meaning, pronunciation, example } = req.body;
    item.type = type;
    item.level = level;
    item.japanese = japanese;
    item.meaning = meaning;
    item.pronunciation = pronunciation || item.pronunciation;
    item.example = example || item.example;

    res.redirect(`/items/${id}`);
});

app.get('/items/:id/delete', (req, res) => {
    const id = Number(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).send('Item not found');

    items = items.filter(i => i.id !== id);
    res.redirect('/');
});

app.get('/search', (req, res) => {
    const { level } = req.query;
    const filteredItems = items.filter(item =>
        item.level.includes(level)
    );
    res.render('index', { items: filteredItems });
});

app.get('/sort', (req, res) => {
    const { by } = req.query;
    let sortedItems = [...items];
    switch (by) {
        case 'japanese':
            sortedItems.sort((a, b) => a.japanese.localeCompare(b.japanese));
            break;
        case 'meaning':
            sortedItems.sort((a, b) => a.meaning.localeCompare(b.meaning));
            break;
        default:
            break;
    }
    res.render('index', { items: sortedItems });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});