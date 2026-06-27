import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { addPropertyStyles as s } from '../../assets/dummyStyles';
import { HiUpload, HiX } from 'react-icons/hi';

const amenitiesList = ['Parking', 'Pool', 'Gym', 'Security', 'Wifi', 'Power Backup', 'Club House', 'Garden'];

const AddProperties = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'flat',
        price: '',
        bhk: '',
        bathrooms: '',
        areaSize: '',
        city: '',
        pincode: '',
        area: '',
        furnishing: 'unfurnished',
        status: 'sale',
        amenities: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files].slice(0, 10);
        setImages(newImages);
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'amenities') {
                    data.append('amenities', JSON.stringify(formData.amenities));
                } else {
                    data.append(key, formData[key]);
                }
            });
            images.forEach(image => data.append('images', image));

            await axios.post(`${API_URL}/api/property`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.outerContainer}>
            <div className={s.innerContainer}>
                <div className={s.header}>
                    <h1 className={s.heading}>List Your Property</h1>
                    <p className={s.subheading}>Fill in the details below to reach thousands of potential buyers.</p>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}

                    {/* Content & Description */}
                    <div className={s.section}>
                        <div className={`${s.sectionHeader} ${s.sectionHeaderLargeMargin}`}>
                            <div className={s.sectionBar}></div>
                            <h2 className={s.sectionTitle}>Content & Description</h2>
                        </div>
                        <div className={s.contentGroupLarge}>
                            <div>
                                <label className={s.label}>Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Luxury 3BHK Apartment Downtown"
                                    className={s.input}
                                    required
                                />
                            </div>
                            <div>
                                <label className={s.label}>Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the property highlights..."
                                    className={`${s.input} ${s.textarea}`}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Details & Pricing */}
                    <div className={s.twoColumnGrid}>
                        {/* Property Details */}
                        <div className={s.section}>
                            <div className={`${s.sectionHeader} ${s.sectionHeaderSmallMargin}`}>
                                <div className={s.sectionBar}></div>
                                <h2 className={s.sectionTitle}>Property Details</h2>
                            </div>
                            <div className={s.contentGroupMedium}>
                                <div>
                                    <label className={s.label}>Property Type</label>
                                    <select
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className={`${s.input} ${s.select}`}
                                    >
                                        <option value="flat">Flat</option>
                                       <option value="apartment">Apartment</option>
<option value="villa">Villa</option>
<option value="house">House</option>
<option value="studio">Studio</option>
<option value="penthouse">Penthouse</option>
<option value="office">Office</option>
<option value="townhouse">Townhouse</option>
<option value="plot">Plot</option>
<option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className={s.gridThreeCol}>
                                    <div>
                                        <label className={s.labelSmallMargin}>BHK</label>
                                        <input type="number" name="bhk" value={formData.bhk} onChange={handleChange} placeholder="e.g. 3" className={s.input} />
                                    </div>
                                    <div>
                                        <label className={s.labelSmallMargin}>Bathrooms</label>
                                        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g. 2" className={s.input} />
                                    </div>
                                    <div>
                                        <label className={s.labelSmallMargin}>Area (Sq.Ft)</label>
                                        <input type="number" name="areaSize" value={formData.areaSize} onChange={handleChange} placeholder="e.g. 1500" className={s.input} />
                                    </div>
                                </div>
                                <div className={s.gridTwoCol}>
                                    <div>
                                        <label className={s.labelSmallMargin}>Furnishing</label>
                                        <select name="furnishing" value={formData.furnishing} onChange={handleChange} className={`${s.input} ${s.select}`}>
                                            <option value="unfurnished">Unfurnished</option>
                                            <option value="semi-furnished">Semi Furnished</option>
                                            <option value="furnished">Furnished</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={s.labelSmallMargin}>Listing Status</label>
                                        <select name="status" value={formData.status} onChange={handleChange} className={`${s.input} ${s.select}`}>
                                            <option value="sale">For Sale</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Location */}
                        <div className={s.section}>
                            <div className={`${s.sectionHeader} ${s.sectionHeaderSmallMargin}`}>
                                <div className={s.sectionBar}></div>
                                <h2 className={s.sectionTitle}>Pricing & Location</h2>
                            </div>
                            <div className={s.contentGroupMedium}>
                                <div>
                                    <label className={s.label}>Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 5000000" className={s.input} required />
                                </div>
                                <div className={s.gridTwoCol}>
                                    <div>
                                        <label className={s.labelSmallMargin}>City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" className={s.input} required />
                                    </div>
                                    <div>
                                        <label className={s.labelSmallMargin}>Pincode</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 400001" className={s.input} required />
                                    </div>
                                </div>
                                <div>
                                    <label className={s.labelSmallMargin}>Specific Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Worli" className={s.input} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className={s.section}>
                        <div className={`${s.sectionHeader} ${s.sectionHeaderSmallMargin}`}>
                            <div className={s.sectionBar}></div>
                            <h2 className={s.sectionTitle}>Amenities</h2>
                        </div>
                        <div className={s.amenitiesGrid}>
                            {amenitiesList.map(amenity => (
                                <label
                                    key={amenity}
                                    className={`${s.amenityLabelBase} ${formData.amenities.includes(amenity) ? s.amenityLabelActive : s.amenityLabelInactive}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className={s.amenityCheckbox}
                                    />
                                    <span className={`${s.amenityTextBase} ${formData.amenities.includes(amenity) ? s.amenityTextActive : s.amenityTextInactive}`}>
                                        {amenity}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Property Images */}
                    <div className={s.section}>
                        <div className={`${s.sectionHeader} ${s.sectionHeaderSmallMargin}`}>
                            <div className={s.sectionBar}></div>
                            <h2 className={s.sectionTitle}>Property Images</h2>
                        </div>

                        <input
                            id="imageUpload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />

                        <div
                            className={s.uploadArea}
                            onClick={() => document.getElementById('imageUpload').click()}
                        >
                            <div className={s.uploadIconWrapper}>
                                <HiUpload size={32} className="text-text-muted" />
                            </div>
                            <p className={s.uploadTitle}>Click to upload or drag and drop</p>
                            <p className={s.uploadSubtext}>Upload upto 10 high-quality images (PNG, JPG)</p>
                        </div>

                        {previews.length > 0 && (
                            <div className={s.previewsGrid}>
                                {previews.map((preview, index) => (
                                    <div key={index} className={s.previewItem}>
                                        <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className={s.removeButton}
                                        >
                                            <HiX size={12} />
                                        </button>
                                    </div>
                                ))}
                                {previews.length < 10 && (
                                    <div
                                        className={s.addMoreBox}
                                        onClick={() => document.getElementById('imageUpload').click()}
                                    >
                                        <HiUpload size={20} className="text-text-muted" />
                                        <span className={s.addMoreText}>Add More</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className={s.footerButtons}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className={s.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={s.submitButton}
                        >
                            {loading ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperties;