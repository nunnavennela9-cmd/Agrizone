/*
# Mandals for more states - Part 2
*/

-- Uttar Pradesh
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'tehsil' FROM districts d, (VALUES
('Lucknow', 'Lucknow'), ('Lucknow', 'Mohanlalganj'), ('Lucknow', 'Bakshi Ka Talab'), ('Lucknow', 'Malihabad'),
('Kanpur Nagar', 'Kanpur'), ('Kanpur Nagar', 'Sadar'), ('Kanpur Nagar', 'Ghatampur'), ('Kanpur Nagar', 'Bilhaur'),
('Varanasi', 'Varanasi'), ('Varanasi', 'Sadat'), ('Varanasi', 'Sevapuri'), ('Varanasi', 'Pindra'), ('Varanasi', 'Phulpur'),
('Agra', 'Agra'), ('Agra', 'Sadabad'), ('Agra', 'Kheragarh'), ('Agra', 'Bah'), ('Agra', 'Fatehabad'),
('Prayagraj', 'Prayagraj'), ('Prayagraj', 'Soraon'), ('Prayagraj', 'Phulpur'), ('Prayagraj', 'Handia'),
('Ghaziabad', 'Ghaziabad'), ('Ghaziabad', 'Modinagar'), ('Ghaziabad', 'Hapur'),
('Gautam Buddha Nagar', 'Noida'), ('Gautam Buddha Nagar', 'Dadri'), ('Gautam Buddha Nagar', 'Jewar'),
('Meerut', 'Meerut'), ('Meerut', 'Mawana'), ('Meerut', 'Sardhana')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Rajasthan
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'tehsil' FROM districts d, (VALUES
('Jaipur', 'Jaipur'), ('Jaipur', 'Amber'), ('Jaipur', 'Chaksu'), ('Jaipur', 'Chomu'), ('Jaipur', 'Phagi'), ('Jaipur', 'Sambhar'),
('Jodhpur', 'Jodhpur'), ('Jodhpur', 'Bhopalgarh'), ('Jodhpur', 'Bilara'), ('Jodhpur', 'Osian'), ('Jodhpur', 'Phalodi'),
('Udaipur', 'Udaipur'), ('Udaipur', 'Girwa'), ('Udaipur', 'Kherwada'), ('Udaipur', 'Mavli'), ('Udaipur', 'Jhadol'),
('Kota', 'Kota'), ('Kota', 'Ladpura'), ('Kota', 'Sangod'), ('Kota', 'Ramganj Mandi'),
('Ajmer', 'Ajmer'), ('Ajmer', 'Kekri'), ('Ajmer', 'Sarwar'), ('Ajmer', 'Nasirabad'),
('Bikaner', 'Bikaner'), ('Bikaner', 'Kolayat'), ('Bikaner', 'Lunkaransar'), ('Bikaner', 'Nokha')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Madhya Pradesh
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'tehsil' FROM districts d, (VALUES
('Bhopal', 'Bhopal'), ('Bhopal', 'Huzur'), ('Bhopal', 'Berasia'),
('Indore', 'Indore'), ('Indore', 'Mhow'), ('Indore', 'Depalpur'), ('Indore', 'Sanwer'),
('Jabalpur', 'Jabalpur'), ('Jabalpur', 'Sihora'), ('Jabalpur', 'Patan'), ('Jabalpur', 'Majholi'),
('Gwalior', 'Gwalior'), ('Gwalior', 'Bhitarwar'), ('Gwalior', 'Dabra'),
('Ujjain', 'Ujjain'), ('Ujjain', 'Nagda'), ('Ujjain', 'Badnagar'), ('Ujjain', 'Mahidpur'),
('Sagar', 'Sagar'), ('Sagar', 'Rahatgarh'), ('Sagar', 'Kesli'), ('Sagar', 'Rehli')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Kerala
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'taluk' FROM districts d, (VALUES
('Thiruvananthapuram', 'Thiruvananthapuram'), ('Thiruvananthapuram', 'Neyyattinkara'), ('Thiruvananthapuram', 'Nedumangad'), ('Thiruvananthapuram', 'Varkala'),
('Ernakulam', 'Kanayannur'), ('Ernakulam', 'Kochi'), ('Ernakulam', 'Paravur'), ('Ernakulam', 'Aluva'), ('Ernakulam', 'Kothamangalam'),
('Kozhikode', 'Kozhikode'), ('Kozhikode', 'Vadakara'), ('Kozhikode', 'Koyilandy'),
('Thrissur', 'Thrissur'), ('Thrissur', 'Chavakkad'), ('Thrissur', 'Kodungallur'), ('Thrissur', 'Mukundapuram'),
('Kollam', 'Kollam'), ('Kollam', 'Karthikapally'), ('Kollam', 'Pathanapuram')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Punjab
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'tehsil' FROM districts d, (VALUES
('Amritsar', 'Amritsar'), ('Amritsar', 'Ajnala'), ('Amritsar', 'Baba Bakala'), ('Amritsar', 'Patti'),
('Ludhiana', 'Ludhiana'), ('Ludhiana', 'Jagraon'), ('Ludhiana', 'Khanna'), ('Ludhiana', 'Samrala'),
('Jalandhar', 'Jalandhar'), ('Jalandhar', 'Nakodar'), ('Jalandhar', 'Phillaur'), ('Jalandhar', 'Shahkot'),
('Patiala', 'Patiala'), ('Patiala', 'Nabha'), ('Patiala', 'Rajpura'), ('Patiala', 'Samana')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Haryana
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'tehsil' FROM districts d, (VALUES
('Gurugram', 'Gurugram'), ('Gurugram', 'Sohna'), ('Gurugram', 'Manesar'),
('Faridabad', 'Faridabad'), ('Faridabad', 'Ballabhgarh'), ('Faridabad', 'Palwal'),
('Rohtak', 'Rohtak'), ('Rohtak', 'Meham'), ('Rohtak', 'Kalanaur'),
('Hisar', 'Hisar'), ('Hisar', 'Hansi'), ('Hisar', 'Barwala'),
('Karnal', 'Karnal'), ('Karnal', 'Gharaunda'), ('Karnal', 'Assandh'), ('Karnal', 'Nilokheri')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Bihar
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'block' FROM districts d, (VALUES
('Patna', 'Patna'), ('Patna', 'Paliganj'), ('Patna', 'Danapur'), ('Patna', 'Phulwari'), ('Patna', 'Fatwah'), ('Patna', 'Barh'),
('Gaya', 'Gaya'), ('Gaya', 'Tikari'), ('Gaya', 'Manpur'), ('Gaya', 'Bodh Gaya'), ('Gaya', 'Wazirganj'),
('Bhagalpur', 'Bhagalpur'), ('Bhagalpur', 'Kharik'), ('Bhagalpur', 'Nathnagar'), ('Bhagalpur', 'Sultanganj'),
('Muzaffarpur', 'Muzaffarpur'), ('Muzaffarpur', 'Bochaha'), ('Muzaffarpur', 'Kudhani'), ('Muzaffarpur', 'Minapur')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- West Bengal
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'block' FROM districts d, (VALUES
('Kolkata', 'Kolkata'), ('Kolkata', 'Taltala'), ('Kolkata', 'Maniktala'),
('North 24 Parganas', 'Barasat'), ('North 24 Parganas', 'Bongaon'), ('North 24 Parganas', 'Basirhat'), ('North 24 Parganas', 'Habra'),
('South 24 Parganas', 'Alipore'), ('South 24 Parganas', 'Diamond Harbour'), ('South 24 Parganas', 'Baruipur'), ('South 24 Parganas', 'Canning'),
('Howrah', 'Howrah'), ('Howrah', 'Bally'), ('Howrah', 'Domjur'), ('Howrah', 'Uluberia'),
('Hooghly', 'Chinsurah'), ('Hooghly', 'Bandel'), ('Hooghly', 'Serampore'), ('Hooghly', 'Chandannagar')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;