const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// Image Upload Limits (Max size: 80KB)
const upload = multer({ 
    storage,
    limits: { fileSize: 80 * 1024 }, // 80KB limit
    fileFilter: function (req, file, cb) {
        // Sirf images allow karna
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Sirf image files allow hain!'), false);
        }
        cb(null, true);
    }
});

// Upload Route with Size Restriction
router.post('/', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "File ka size 80KB se zyada nahi hona chahiye!" });
    }
    next();
}, productController.createProduct);
// router.post('/', productController.createProduct);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
