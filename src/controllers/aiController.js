
const mockFabricDB = [
    { id: 'fab1', name: 'Cotton', type: 'Breathable', color: 'White' },
    { id: 'fab2', name: 'Linen', type: 'Lightweight', color: 'Beige' },
    { id: 'fab3', name: 'Silk', type: 'Elegant', color: 'Black' },
    { id: 'fab4', name: 'Denim', type: 'Sturdy', color: 'Blue' },
    { id: 'fab5', name: 'Satin', type: 'Shiny', color: 'Red' },
  ];
  
  export function mockAIRecommendFabric(req, res) {
    const { designType, season, useCase } = req.body;
  
    if (!designType || !season || !useCase) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
  
    let recommendations = [];
  
    // Basic mock logic
    if (designType === 'eveningwear') {
      recommendations = mockFabricDB.filter((f) =>
        ['Satin', 'Silk'].includes(f.name)
      );
    } else if (season === 'summer') {
      recommendations = mockFabricDB.filter((f) =>
        ['Linen', 'Cotton'].includes(f.name)
      );
    } else if (useCase === 'casual') {
      recommendations = mockFabricDB.filter((f) =>
        ['Denim', 'Cotton'].includes(f.name)
      );
    } else {
      recommendations = mockFabricDB.slice(0, 3); // fallback
    }
  
    res.status(200).json({
      message: 'Mock AI fabric recommendation generated',
      input: { designType, season, useCase },
      recommendedFabrics: recommendations,
    });
  }
  