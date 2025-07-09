import React, { useState } from "react";
import './Login-signup.css';

const Loginsignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [searchActive, setSearchActive] = useState(false);
    const [showInputs, setShowInputs] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [district, setDistrict] = useState('');
    const [donors, setDonors] = useState([]);

    const districts = [ 'Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam',
        'Idukki','Ernakulam','Thrissur','Palakkad','Malappuram',
        'Kozhikode','Wayanad','Kannur','Kasaragod' ];

    const bloodTypes = [
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
    ];
    const reverseConvertBloodType = (bloodType) => {
        const map = {
            'Apositive': 'A+',
            'Anegative': 'A−',
            'Bpositive': 'B+',
            'Bnegative': 'B−',
            'ABpositive': 'AB+',
            'ABnegative': 'AB−',
            'Opositive': 'O+',
            'Onegative': 'O−'
        };
        return map[bloodType] || bloodType;
    };
    const convertBloodTypeForSearch = (bloodType) => {
        switch (bloodType) {
            case 'A+': return 'Apositive';
            case 'A−': return 'Anegative';
            case 'B+': return 'Bpositive';
            case 'B−': return 'Bnegative';
            case 'AB+': return 'ABpositive';
            case 'AB−': return 'ABnegative';
            case 'O+': return 'Opositive';
            case 'O−': return 'Onegative';
            default: return bloodType;
        }
    };


    const handleSignup = async () => {
        if (!name || !email || !contact || !bloodType || !district) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await fetch('https://bloodbank-z3dg.onrender.com/api/donors/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, contact, bloodType, district })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Donor registered successfully!');
                setName('');
                setEmail('');
                setContact('');
                setBloodType('');
                setDistrict('');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Server error while registering');
        }
    };

    const fetchDonors = async () => {
        if (!bloodType || !district) {
            alert("Please select blood type and district to search.");
            return;
        }

        try {
            const bloodTypeConverted = convertBloodTypeForSearch(bloodType);
            const res = await fetch(`https://bloodbank-z3dg.onrender.com/api/donors/search?bloodType=${bloodTypeConverted}&district=${district}`);
            const data = await res.json();

            const updatedData = data.map(donor => ({
                ...donor,
                bloodType: reverseConvertBloodType(donor.bloodType)
            }));

            setDonors(updatedData);
        } catch (err) {
            console.error(err);
            alert("Error fetching donors");
        }
    };

    return (
        <div className='full'>
            <div className='top-bar'>
                <div className='title'><h1>Blood Bank</h1></div>
            </div>

            <div className='container'>
                <div className='Header'>
                    <div className='text'>{action}</div>
                    <div className='underline'></div>
                </div>

                {action === "Search" && !showInputs && (
                    <div className='donor-list'>
                        <h2>Available Donors</h2>
                        {donors.length > 0 ? (
                            <ul>
                                {donors.map((donor, index) => (
                                    <li key={index}>
                                        Name: {donor.name}<br />
                                        Blood Type: {donor.bloodType}<br />
                                        District: {donor.district}<br />
                                        Email: {donor.email}<br />
                                        Contact: {donor.contact}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>oops ,No donors found.</p>
                        )}
                    </div>
                )}

                {showInputs && (
                    <div className='inputs'>
                        {action !== "Search" && (
                            <>
                                <div className='input'>
                                    <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='input'>
                                    <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className='input'>
                                    <input type="text" placeholder="+91 xxxxxxxxx" value={contact} onChange={(e) => setContact(e.target.value)} />
                                </div>
                            </>
                        )}

                        <div className='input'>
                            <select className="dropdown" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                                <option value="">-- Select a blood type --</option>
                                {bloodTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className='input'>
                            <select className="dropdown" value={district} onChange={(e) => setDistrict(e.target.value)}>
                                <option value="">-- District --</option>
                                {districts.map((dist, index) => (
                                    <option key={index} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}



                <div className='submit'>
                    <div className={action === "Search" ? "hehe" : "hehe grey"}
                         onClick={() => {
                             if (searchActive) {
                                 console.log("Searching for donors:", bloodType, district);
                                 fetchDonors().then(() => {
                                     setShowInputs(false);
                                 });
                             } else {
                                 setAction("Search");
                                 setSearchActive(true);
                                 setShowInputs(true);
                             }
                         }}
                    >Search</div>

                    <div
                        className={action === "Sign Up" ? "hehe" : "hehe grey"}
                        onClick={() => {
                            if (action === "Sign Up") {
                                // Second click: actually submit
                                handleSignup();
                            } else {
                                // First click: just show form
                                setAction("Sign Up");
                                setShowInputs(true);
                                setSearchActive(false);
                            }
                        }}
                    >
                        Sign Up
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginsignup;
