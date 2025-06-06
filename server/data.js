
const data = {
    home_images: [
        {
            title: 'home-image-carters-1.jpg',
            caption: 'Home image carters 1',
            brand: "Carter's"
        },
        {
            title: 'home-image-carters-2.gif',
            caption: 'Home image carters 2',
            brand: "Carter's"
        },
        {
            title: 'home-image-melissa_and_doug-1.jpg',
            caption:  'Home image Melissa and Doug 1',
            brand: "Melissa & Doug" 
        },
        {
            title: 'home-image-melissa_and_doug-2.jpg',
            caption:  'Home image Melissa and Doug 2',
            brand: "Melissa & Doug" 
        },
        {
            title: 'home-image-melissa_and_doug-3.gif',
            caption:  'Home image Melissa and Doug 3',
            brand: "Melissa & Doug" 
        }
    ],

    //
    products: [
        {
            title: 'Stuffed Elephant',
            category: 'Toys',
            brand: "Lampy",
            price: 42.2,
            dimensions: '18 x 16 x 25',
            characteristics: 'Soft and cuddly, machine washable, suitable for all ages',
            inventory: 3,
            images: [
                {
                    title: 'stuffed_elephant_0.png',
                    caption: 'Stuffed Elephant image 0'
                },
                {
                    title: 'stuffed_elephant_1.png',
                    caption: 'Stuffed Elephant image 1'
                },
                {
                    title: 'stuffed_elephant_2.png',
                    caption: 'Stuffed Elephant image 2'
                },
                {
                    title: 'stuffed_elephant_3.png',
                    caption: 'Stuffed Elephant image 3'
                }
            ]
        },
        {
            title: 'Glass Baby Bottle with Silicone Sleeve',
            category: 'Baby Bottles',
            brand: "Philips",
            price: 48,
            dimensions: '3 x 3 x 8',
            characteristics: 'Durable, BPA-free, heat-resistant',
            inventory: 25,
            images: [
                {
                    title: 'glass_baby_bottle_with_silicone_sleeve_0.png',
                    caption: 'Glass baby bottle with silicone sleeve 0'
                },
                {
                    title: 'glass_baby_bottle_with_silicone_sleeve_1.png',
                    caption: 'Glass baby bottle with silicone sleeve 1'
                },
                {
                    title: 'glass_baby_bottle_with_silicone_sleeve_2.png',
                    caption: 'Glass baby bottle with silicone sleeve 2'
                },
                {
                    title: 'glass_baby_bottle_with_silicone_sleeve_3.png',
                    caption: 'Glass baby bottle with silicone sleeve 3'
                }
            ]
        },
        {
            title: 'Activity Garden',
            category: 'Toys',
            brand: "Lampy",
            price: 95.99,
            dimensions: '25 x 18 x 20',
            characteristics: 'The Little Tikes Activity Garden easily converts from a closed play center to an open, two-sided play center without tools to grow with your child',
            inventory: 18,
            images: [
                {
                    title: 'Activity_Garden_0.png',
                    caption: 'Activity Garden 0'
                },
                {
                    title: 'Activity_Garden_1.png',
                    caption: 'Activity Garden 1'
                },
                {
                    title: 'Activity_Garden_2.png',
                    caption: 'Activity Garden 2'
                },
                {
                    title: 'Activity_Garden_3.png',
                    caption: 'Activity Garden 3'
                }           
            ]
        },
        {
            title: 'Baby 3-Pack Bibs',
            category: 'Baby Accessories',
            brand: "Adventure",
            price: 15.49,
            dimensions: '10 x 7.5 x 4',
            characteristics: '3-Pack Cute and Fun Baby Bibs for Boy and Girl - Our organic baby boy bibs and girl bibs are exclusively designed to ensure that your baby never runs out of styling options.',
            inventory: 56,
            images: [
                {
                    title: 'Baby_3_Pack_Bibs_0.png',
                    caption: 'Baby 3-Pack Bibs 0'
                },
                {
                    title: 'Baby_3_Pack_Bibs_1.png',
                    caption: 'Baby 3-Pack Bibs 1'
                }    
            ]
        },{
            title: 'Baby 3-Piece Whale Little Cardigan Set',
            category: 'Baby Clothes',
            brand: "Carter's",
            price: 25.10,
            dimensions: '12 x 8 x 4',
            characteristics: 'Crafted in extra soft slub jersey with a super cute print, this set is complete with a short-sleeve bodysuit to pair with easy on pants and a matching cardigan.',
            inventory: 126,
            images: [
                {
                    title: 'Baby_3-Piece_Whale_Little_Cardigan_Set_0.png',
                    caption: 'Baby 3-Piece Whale Little Cardigan Set 0'
                },
                {
                    title: 'Baby_3-Piece_Whale_Little_Cardigan_Set_1.png',
                    caption: 'Baby 3-Piece Whale Little Cardigan Set 1'
                },
                {
                    title: 'Baby_3-Piece_Whale_Little_Cardigan_Set_2.png',
                    caption: 'Baby 3-Piece Whale Little Cardigan Set 2'
                }     
            ]
        },
        {
            title: 'Baby Bodysuits 5-Pack Short-Sleeve Bodysuits',
            category: 'Baby Clothes',
            brand: "looks",
            price: 35.49,
            dimensions: '25 x 18 x 20',
            characteristics: 'Crafted in soft cotton, this pack of five is perfect for baby.',
            inventory: 112,
            images: [
                {
                    title: 'Baby_Bodysuits_5-Pack_Short_Sleeve_Bodysuits_0.png',
                    caption: 'Baby Bodysuits 5-Pack Short-Sleeve Bodysuits 0'
                },
                {
                    title: 'Baby_Bodysuits_5-Pack_Short_Sleeve_Bodysuits_1.png',
                    caption: 'Baby Bodysuits 5-Pack Short-Sleeve Bodysuits 1'
                },
                {
                    title: 'Baby_Bodysuits_5-Pack_Short_Sleeve_Bodysuits_2.png',
                    caption: 'Baby Bodysuits 5-Pack Short-Sleeve Bodysuits 2'
                },
                {
                    title: 'Baby_Bodysuits_5-Pack_Short_Sleeve_Bodysuits_3.png',
                    caption: 'Baby Bodysuits 5-Pack Short-Sleeve Bodysuits 3'
                }
            ]
        },
        {
            title: 'Baby Double Knit Wearable Blanket',
            category: 'Baby Accessories',
            brand: "looks",
            price: 27.19,
            dimensions: '42 x 35',
            characteristics: 'Soft, organic cotton double-knit wearable blanket for a bedtime routine that s comfy, safe and snug keeping your baby at just the right temp.',
            inventory: 45,
            images: [
                {
                    title: 'Baby_Double_Knit_Wearable_Blanket_0.png',
                    caption: 'Baby Double Knit Wearable Blanket 0'
                },
                {
                    title: 'Baby_Double_Knit_Wearable_Blanket_1.png',
                    caption: 'Baby Double Knit Wearable Blanket 1'
                },
                {
                    title: 'Baby_Double_Knit_Wearable_Blanket_2.png',
                    caption: 'Baby Double Knit Wearable Blanket 2'
                },
                {
                    title: 'Baby_Double_Knit_Wearable_Blanket_3.png',
                    caption: 'Baby Double Knit Wearable Blanket 3'
                }             
            ]
        },
        {
            title: 'Baby Every Step Hook & Loop Soft Sandals',
            category:  'Baby Clothes',
            brand: "New Power",
            price: 23.40,
            dimensions: '4.2 x 2.8 x 2.2',
            characteristics: 'Designed for his growing feet, these shoes are perfect for baby.',
            inventory: 52,
            images: [
                {
                    title: 'Baby_Every_Step_Hook_&_Loop_Soft_Sandals_0.png',
                    caption: 'Baby Every Step Hook & Loop Soft Sandals 0'
                },
                {
                    title: 'Baby_Every_Step_Hook_&_Loop_Soft_Sandals_1.png',
                    caption: 'Baby Every Step Hook & Loop Soft Sandals 1'
                },    
                {
                    title: 'Baby_Every_Step_Hook_&_Loop_Soft_Sandals_2.png',
                    caption: 'Baby Every Step Hook & Loop Soft Sandals 2'
                },    
                {
                    title: 'Baby_Every_Step_Hook_&_Loop_Soft_Sandals_3.png',
                    caption: 'Baby Every Step Hook & Loop Soft Sandals 3'
                },    
                {
                    title: 'Baby_Every_Step_Hook_&_Loop_Soft_Sandals_4.png',
                    caption: 'Baby Every Step Hook & Loop Soft Sandals 4'
                }               
            ]
        },
        {
            title: 'Baby -Smiles For Papa- Sleeveless Bodysuit',
            category: 'Baby Clothes',
            brand: "Carter's",
            price: 16.49,
            dimensions: '7 x 5 x 3',
            characteristics: 'Crafted in soft cotton with a slogan about Papa, this bodysuit will be a family favorite.',
            inventory: 75,
            images: [
                {
                    title: 'Baby_Smiles_For_Papa_Sleeveless_Bodysuit_0.png',
                    caption: 'Baby -Smiles For Papa- Sleeveless Bodysuit 0'
                },
                {
                    title: 'Baby_Smiles_For_Papa_Sleeveless_Bodysuit_1.png',
                    caption: 'Baby -Smiles For Papa- Sleeveless Bodysuit 1'
                }        
            ]
        },
        {
            title: 'BOHS Foam Learning Blocks',
            category: 'Educational Toys',
            brand: "Learning Space",
            price: 25.2,
            dimensions: '16 x 15 x 8',
            characteristics: 'Soft block set for babies and toddlers. Lightweight pieces (10 cubes and 4 triangles) are easy for young children to lift and manipulate.',
            inventory: 26,
            images: [
                {
                    title: 'BOHS_Foam_Learning_Blocks_0.png',
                    caption: 'BOHS Foam Learning Blocks 0'
                },
                {
                    title: 'BOHS_Foam_Learning_Blocks_1.png',
                    caption: 'BOHS Foam Learning Blocks 1'
                },
                {
                    title: 'BOHS_Foam_Learning_Blocks_2.png',
                    caption: 'BOHS Foam Learning Blocks 2'
                },
                {
                    title: 'BOHS_Foam_Learning_Blocks_3.png',
                    caption: 'BOHS Foam Learning Blocks 3'
                }           
            ]
        },
        {
            title: 'Friendly Face Toy',
            category: 'Toys',
            brand: "Enjoyable",
            price: 26.89,
            dimensions: '21 x 17 x 7',
            characteristics: 'This friendly face is the perfect toy for sensory stimulation! With high contrast fabrics, a baby-safe mirror, rattles, squeakers, and crinkle paper.',
            inventory: 5,
            images: [
                {
                    title: 'Friendly_Face_Toy_0.png',
                    caption: 'Friendly Face Toy 0'
                },
                {
                    title: 'Friendly_Face_Toy_1.png',
                    caption: 'Friendly Face Toy 1'
                },     
                {
                    title: 'Friendly_Face_Toy_2.png',
                    caption: 'Friendly Face Toy 2'
                },     
                {
                    title: 'Friendly_Face_Toy_3.png',
                    caption: 'Friendly Face Toy 3'
                }      
            ]
        },
        {
            title: 'Infant Stim To Go',
            category: 'Toys',
            brand: "Enjoyable",
            price: 15.69,
            dimensions: '10 x 8 x 5',
            characteristics: 'Features six reversible cards with high-contrast images supporting baby-s natural progression of visual development.',
            inventory: 37,
            images: [
                {
                    title: 'Infant_Stim_To_Go_0.png',
                    caption: 'Infant Stim To Go - 0'
                },  
                {
                    title: 'Infant_Stim_To_Go_1.png',
                    caption: 'Infant Stim To Go - 1'
                },  
                {
                    title: 'Infant_Stim_To_Go_2.png',
                    caption: 'Infant Stim To Go - 2'
                }         
            ]
        },
        {
            title: 'Learning Lane Activity Walker',
            category: 'Educational Toys',
            brand: "Learning Space",
            price: 47.99,
            dimensions: '31 x 22 x 20',
            characteristics: 'Learning Lane Activity Walker encourages early walking and helps kids discover the rules of the road. This driving-themed walker offers three different ways to play. ',
            inventory: 12,
            images: [
                {
                    title: 'Learning_Lane_Activity_Walker_0.png',
                    caption: 'Learning Lane Activity Walker 0'
                },
                {
                    title: 'Learning_Lane_Activity_Walker_1.png',
                    caption: 'Learning Lane Activity Walker 1'
                },
                {
                    title: 'Learning_Lane_Activity_Walker_2.png',
                    caption: 'Learning Lane Activity Walker 2'
                },
                {
                    title: 'Learning_Lane_Activity_Walker_3.png',
                    caption: 'Learning Lane Activity Walker 3'
                }
            ]
        },
        {
            title: 'Mind Shapes',
            category: 'Educational Toys',
            brand: "Learning Space",
            price: 25.65,
            dimensions: '12 x 10 x 6',
            characteristics: "Let baby's playtime shape with this 3-piece soft shape set! Each shape has a noisemaker and medley of research-based high-contrast graphics.",
            inventory: 50,
            images: [
                {
                    title: 'Mind_Shapes_0.png',
                    caption: 'Mind Shapes 0'
                },
                {
                    title: 'Mind_Shapes_1.png',
                    caption: 'Mind Shapes 1'
                },
                {
                    title: 'Mind_Shapes_2.png',
                    caption: 'Mind Shapes 2'
                }       
            ]
        },
        {
            title: 'Baby 2-Piece Bodysuit & Sweater Coveralls',
            category:  'Baby Clothes',
            brand: "Carter's",
            price: 28.15,
            dimensions: '12 x 9 x 6',
            characteristics: "2-piece set / Long sleeves / Made to match, this cozy set is complete with a long-sleeve bodysuit and a pair of coveralls, too.",
            inventory: 19,
            images: [
                {
                    title: 'Baby_2-Piece_Bodysuit_&_Sweater_Coveralls_0.png',
                    caption: 'Baby 2-Piece Bodysuit & Sweater Coveralls 0'
                },
                {
                    title: 'Baby_2-Piece_Bodysuit_&_Sweater_Coveralls_1.png',
                    caption: 'Baby 2-Piece Bodysuit & Sweater Coveralls 1'
                },
                {
                    title: 'Baby_2-Piece_Bodysuit_&_Sweater_Coveralls_2.png',
                    caption: 'Baby 2-Piece Bodysuit & Sweater Coveralls 2'
                },
                {
                    title: 'Baby_2-Piece_Bodysuit_&_Sweater_Coveralls_3.png',
                    caption: 'Baby 2-Piece Bodysuit & Sweater Coveralls 3'
                }       
            ]
        },
        {
            title: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces',
            category: 'Educational Toys',
            brand: "Melissa & Doug", 
            price: 38.25,
            dimensions: '11.5 x 7.5 x 5',
            characteristics: "Fit together 45 sturdy jumbo cardboard jigsaw puzzle pieces to complete a colorful map of the United States, Educational and fun, featuring the locations of 63 national parks and many of the animals and key park features",
            inventory: 26,
            images: [
                {
                    title: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces_0.png',
                    caption: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces 0'
                },
                {
                    title: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces_1.png',
                    caption: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces 1'
                },
                {
                    title: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces_2.png',
                    caption: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces 2'
                },
                {
                    title: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces_3.png',
                    caption: 'National Parks U.S.A. Map Floor Puzzle - 45 Pieces 3'
                }   
            ]
        },
        {
            title: 'Farm Cube Puzzle - 16 Pieces',
            category:  'Educational Toys',
            brand: "Melissa & Doug",
            price: 33.15,
            dimensions: '8.25 x 8.25 x 2.5',
            characteristics: "Match picture clues to complete six favorite farm animals / 16 cubes and a durable wooden tray; 6 puzzles in one / Develop visual and manipulative skills",
            inventory: 57,
            images: [
                {
                    title: 'Farm Cube Puzzle - 16 Pieces_0.png',
                    caption: 'Farm Cube Puzzle - 16 Pieces 0'
                },
                {
                    title: 'Farm Cube Puzzle - 16 Pieces_1.png',
                    caption: 'Farm Cube Puzzle - 16 Pieces 1'
                },
                {
                    title: 'Farm Cube Puzzle - 16 Pieces_2.png',
                    caption: 'Farm Cube Puzzle - 16 Pieces 2'
                },
                {
                    title: 'Farm Cube Puzzle - 16 Pieces_3.png',
                    caption: 'Farm Cube Puzzle - 16 Pieces 3'
                }    
            ]
        },
        {
            title: 'See & Spell Learning Toy',
            category: 'Educational Toys',
            brand: "Melissa & Doug",
            price: 23.99,
            dimensions: '14 x 9.2 x 4',
            characteristics: "Place letters into wooden puzzle boards to spell words that match illustrations / Includes 8 double-sided wooden puzzle boards and 64 wooden letters / Fits into one compact wooden storage case",
            inventory: 39,
            images: [
                {
                    title: 'See & Spell Learning Toy_0.png',
                    caption: 'See & Spell Learning Toy 0'
                },
                {
                    title: 'See & Spell Learning Toy_1.png',
                    caption: 'See & Spell Learning Toy 1'
                },
                {
                    title: 'See & Spell Learning Toy_2.png',
                    caption: 'See & Spell Learning Toy 2'
                },
                {
                    title: 'See & Spell Learning Toy_3.png',
                    caption: 'See & Spell Learning Toy 3'
                }     
            ]
        }
    ]

}

module.exports = {data}