/*
# Mandals for more states - Part 1

Adding mandals/taluks/blocks/tehsils for states across India.
*/

-- Andhra Pradesh
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'mandal' FROM districts d, (VALUES
('Guntur', 'Guntur'), ('Guntur', 'Tenali'), ('Guntur', 'Repalle'), ('Guntur', 'Bapatla'), ('Guntur', 'Ponnur'), ('Guntur', 'Mangalagiri'), ('Guntur', 'Sattenapalle'), ('Guntur', 'Narasaraopet'), ('Guntur', 'Vinukonda'), ('Guntur', 'Macherla'),
('Krishna', 'Vijayawada'), ('Krishna', 'Machilipatnam'), ('Krishna', 'Gudivada'), ('Krishna', 'Nuzvid'), ('Krishna', 'Tiruvuru'), ('Krishna', 'Pedana'),
('Kurnool', 'Kurnool'), ('Kurnool', 'Nandyal'), ('Kurnool', 'Adoni'), ('Kurnool', 'Dhone'), ('Kurnool', 'Allagadda'), ('Kurnool', 'Atmakur'), ('Kurnool', 'Pattikonda'),
('Chittoor', 'Chittoor'), ('Chittoor', 'Tirupati'), ('Chittoor', 'Madanapalle'), ('Chittoor', 'Pileru'), ('Chittoor', 'Puttur'), ('Chittoor', 'Palamaner'),
('Anantapur', 'Anantapur'), ('Anantapur', 'Guntakal'), ('Anantapur', 'Tadipatri'), ('Anantapur', 'Dharmavaram'), ('Anantapur', 'Hindupur'), ('Anantapur', 'Kadiri'),
('Prakasam', 'Ongole'), ('Prakasam', 'Chirala'), ('Prakasam', 'Kandukur'), ('Prakasam', 'Markapur'), ('Prakasam', 'Giddalur'),
('Srikakulam', 'Srikakulam'), ('Srikakulam', 'Palasa'), ('Srikakulam', 'Tekkali'), ('Srikakulam', 'Amadalavalasa'),
('Vizianagaram', 'Vizianagaram'), ('Vizianagaram', 'Bobbili'), ('Vizianagaram', 'Parvathipuram'), ('Vizianagaram', 'Salur')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Karnataka
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'taluk' FROM districts d, (VALUES
('Bangalore Urban', 'Bangalore North'), ('Bangalore Urban', 'Bangalore South'), ('Bangalore Urban', 'Bangalore East'), ('Bangalore Urban', 'Anekal'),
('Bangalore Rural', 'Devanahalle'), ('Bangalore Rural', 'Hoskote'), ('Bangalore Rural', 'Nelamangala'), ('Bangalore Rural', 'Doddaballapura'),
('Mysore', 'Mysore'), ('Mysore', 'Nanjangud'), ('Mysore', 'Hunsur'), ('Mysore', 'HD Kote'), ('Mysore', 'KR Nagar'),
('Belgaum', 'Belgaum'), ('Belgaum', 'Khanapur'), ('Belgaum', 'Bailhongal'), ('Belgaum', 'Chikodi'), ('Belgaum', 'Gokak'), ('Belgaum', 'Athni'),
('Dakshina Kannada', 'Mangalore'), ('Dakshina Kannada', 'Bantwal'), ('Dakshina Kannada', 'Puttur'), ('Dakshina Kannada', 'Sullia'),
('Udupi', 'Udupi'), ('Udupi', 'Kapu'), ('Udupi', 'Kundapur'), ('Udupi', 'Karkala'),
('Shimoga', 'Shimoga'), ('Shimoga', 'Bhadravati'), ('Shimoga', 'Sagar'), ('Shimoga', 'Shikaripura'),
('Dharwad', 'Dharwad'), ('Dharwad', 'Hubli'), ('Dharwad', 'Kalghatgi'), ('Dharwad', 'Kundgol')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Tamil Nadu
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'taluk' FROM districts d, (VALUES
('Chennai', 'Chennai'), ('Chennai', 'Egmore'), ('Chennai', 'Tondiarpet'),
('Coimbatore', 'Coimbatore North'), ('Coimbatore', 'Coimbatore South'), ('Coimbatore', 'Pollachi'), ('Coimbatore', 'Mettupalayam'),
('Madurai', 'Madurai North'), ('Madurai', 'Madurai South'), ('Madurai', 'Melur'), ('Madurai', 'Tirumangalam'),
('Salem', 'Salem'), ('Salem', 'Attur'), ('Salem', 'Mettur'), ('Salem', 'Omalur'),
('Tiruchirappalli', 'Tiruchirappalli West'), ('Tiruchirappalli', 'Tiruchirappalli East'), ('Tiruchirappalli', 'Manapparai'), ('Tiruchirappalli', 'Lalgudi'),
('Tirunelveli', 'Tirunelveli'), ('Tirunelveli', 'Ambasamudram'), ('Tirunelveli', 'Tenkasi'),
('Vellore', 'Vellore'), ('Vellore', 'Arcot'), ('Vellore', 'Gudiyatham'), ('Vellore', 'Katpadi')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Maharashtra
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'taluka' FROM districts d, (VALUES
('Pune', 'Pune City'), ('Pune', 'Haveli'), ('Pune', 'Shirur'), ('Pune', 'Baramati'), ('Pune', 'Daund'), ('Pune', 'Junnar'),
('Thane', 'Thane'), ('Thane', 'Kalyan'), ('Thane', 'Dombivli'), ('Thane', 'Ulhasnagar'), ('Thane', 'Bhiwandi'),
('Nagpur', 'Nagpur'), ('Nagpur', 'Katol'), ('Nagpur', 'Ramtek'), ('Nagpur', 'Savner'), ('Nagpur', 'Kamptee'),
('Nashik', 'Nashik'), ('Nashik', 'Sinnar'), ('Nashik', 'Igatpuri'), ('Nashik', 'Malegaon'), ('Nashik', 'Niphad'),
('Solapur', 'Solapur North'), ('Solapur', 'Solapur South'), ('Solapur', 'Barshi'), ('Solapur', 'Pandharpur')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;

-- Gujarat
INSERT INTO mandals (district_id, name, type)
SELECT d.id, m.name, 'taluka' FROM districts d, (VALUES
('Ahmedabad', 'Ahmedabad City'), ('Ahmedabad', 'Daskroi'), ('Ahmedabad', 'Bavla'), ('Ahmedabad', 'Dhandhuka'), ('Ahmedabad', 'Sanand'),
('Surat', 'Surat City'), ('Surat', 'Chorasi'), ('Surat', 'Bardoli'), ('Surat', 'Mahuva'), ('Surat', 'Olpad'),
('Vadodara', 'Vadodara'), ('Vadodara', 'Waghodia'), ('Vadodara', 'Savli'), ('Vadodara', 'Dabhoi'), ('Vadodara', 'Padra'),
('Rajkot', 'Rajkot'), ('Rajkot', 'Wankaner'), ('Rajkot', 'Dhoraji'), ('Rajkot', 'Gondal'), ('Rajkot', 'Jetpur')
) AS m(district, name)
WHERE d.name = m.district
ON CONFLICT DO NOTHING;