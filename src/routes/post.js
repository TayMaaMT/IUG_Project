const router = require('express').Router();
const {upload}=require('../middleware/multer');
const {firebaseUpload}=require('../middleware/upload');
const { creat,find,increment,update,decrement,delete_} = require('../models/user');
const auth = require('../middleware/auth');
router.post('/addPost',auth,upload.single('picture'),firebaseUpload, async(req, res) => {
    try {
        let picture;
        const { content ,postType} = req.body;
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const name = user[0].name;
        console.log(req.imageURL)
        if (req.imageURL) {
            console.log("I`m in again ...............")
            picture = req.imageURL;
            await creat('posts', { content, user_id, name ,postType,picture});
        }else{
            await creat('posts', { content, user_id, name ,postType});
        }

        res.status(200).json({ Success: "add post" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }

})


router.get('/posts', async(req, res) => {
    try {
        const posts = await find('posts');
        for (let post in posts) {
            const comments = await find('comments', { post_id: posts[post].id })
            const likes = await find('likes', { post_id: posts[post].id })
            posts[post].comments = comments;
            posts[post].likes = likes;
        }
        res.status(200).json({ posts });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }

})

// router.get('/post/:id/img', async(req, res) => {
//     try {
//         const post = await find('posts', { id: req.params.id });
//         console.log(post);
//         res.set('Content-Type', 'image/jpg');
//         res.send(post[0].image);
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ Error: err })
//     }

// })


router.post('/addcomment', auth, async(req, res) => {
    try {
        const { content, post_id } = req.body;
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const name = user[0].name;
        await increment('posts', post_id, 'numbercomments');
        const comment = await creat('comments', { content, post_id, user_id, name });
        res.status(200).json({ Success: "add comment" });
    } catch (err) {
        res.status(400).json({ Error: err })
    }
});

router.post('/addlike', auth, async(req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const name = user[0].name;

        await increment('posts', post_id, 'numberlikes');
        const like = await creat('likes', {  post_id, user_id, name });
        res.status(200).json({ Success: "add like" });
    } catch (err) {
        res.status(400).json({ Error: err })
    }
});

router.put('/editComment', auth, async(req, res) => {
    try {
        const { content, id } = req.body;
        const user_id = req.id;
        const user = await find('comments', { user_id })
        if (user[0]) {
            await update('comments', { id }, { content });
            res.status(200).json({ Success: "edit" });
        } else {
            throw "cannot edit this comments"
        }

    } catch (err) {
        res.status(400).json({ Error: err })
    }
})

router.delete('/deleteComment', auth, async(req, res) => {
    try {
        const { id } = req.body;
        const user_id = req.id;
        const user = await find('comments', { user_id,id })
        if (user[0]) {
            await decrement('posts', user[0].post_id, 'numbercomments');
            await delete_('comments', { id });
            res.status(200).json({ Success: "delete" });
        } else {
            throw "your cant delete comment"
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
})



router.delete('/deleteLike', auth, async(req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.id;
        const user = await find('likes', { user_id, post_id })
        if (user[0]) {
            await decrement('posts', post_id ,'numberlikes');
            await delete_('likes', { id: user[0].id });
            res.status(200).json({ Success: "delete" });
            req.io.emit(`post_${user[0].id}`, { delete_Like: { id: user[0].id }, numberlikes })
        } else {
            throw "your cant remove this like"
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
})
router.delete('/deletePost', auth, async(req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.id;
        const user = await find('posts', { user_id})
        if (user[0]) {
            await delete_('posts', { id: post_id });
            res.status(200).json({ Success: "delete" });
        } else {
            throw "your cant remove this like"
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
})

module.exports = router;