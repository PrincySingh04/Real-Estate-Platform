import wishList from "../models/wishlist.model.js";

// to add property to wishlist
export const addWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const existing = await wishList.findOne({
            user: req.user._id,
            property: propertyId
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Already in wishlist"
            });
        }

        await wishList.create({
            user: req.user._id,
            property: propertyId
        });

        res.status(201).json({
            success: true,
            message: "Added to wishlist"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message  // ✅ fixed
        });
    }
};

// to get the properties in wishlist
export const getWishlist = async (req, res) => {
    try {
        const data = await wishList.find({
            user: req.user._id,
        }).populate("property");  // ✅ lowercase

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({   // ✅ fixed typo
            success: false,
            message: error.message  // ✅ fixed
        });
    }
};

// to remove property from wishlist
export const removeWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const result = await wishList.findOneAndDelete({
            user: req.user._id,
            property: propertyId
        });

        if (!result) {
            return res.status(404).json({
                success: false,           // ✅ fixed typo
                message: "Property not found in wishlist"  // ✅ fixed message
            });
        }

        res.status(200).json({            // ✅ added missing response
            success: true,
            message: "Removed from wishlist"
        });

    } catch (error) {
        res.status(500).json({   // ✅ fixed typo
            success: false,
            message: error.message  // ✅ fixed
        });
    }
};