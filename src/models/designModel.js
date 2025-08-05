import prisma from '../config/database.js';

export async function createDesign(data) {
  return prisma.design.create({ 
    data,
    include: {
      imageMetadata: true
    }
  });
}

export async function getUserDesigns(userId) {
  return prisma.design.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
          select: {
              name: true
          }
      },
      imageMetadata: {
        select: {
          id: true,
          url: true,
        }
        
      },
      initialFabric: {
        select:{
          id:true,
          name: true,
          imageUrl: true
        }
      }
    }
  });
}

export async function getDesignById(id) {
  return prisma.design.findUnique({
    where: { id },
    include: {
      // Include the user who created the sketch
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
      imageMetadata: {
        select:{
          url: true,
          name: true,
          type: true,
          size: true
        }
      },
      // Include the fabric that was initially chosen by the user
      initialFabric: {
        select: {
          name: true,
          type: true,
          composition: true,
          imageUrl: true,
          color: true,
          price: true,
          // supplier: true, // Assuming you add a supplier field
        }
      },
      // Include all the 3D rendered designs associated with this sketch
      renderedDesigns: {
        orderBy: {
          createdAt: 'desc', // Show the newest versions first
        },
        include: {
          // For each rendered design, include the fabric it was rendered with
          fabric: true,
          // And include the admin who created it
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      },
       // Include all comments related to this design
      comments: {
        include: {
          author: {
            select: {
              name: true,
              profilePicture: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
  });
}
  

export async function updateDesign(id, data) {
  return prisma.design.update({
    where: { id },
    data,
  });
}

export async function deleteDesign(id) {
  return prisma.design.delete({
    where: { id },
  });
}

export async function getDesignsAwaitingRender() {
    return prisma.design.findMany({
        where: { status: 'UPLOADED' },
        orderBy: { createdAt: 'asc' },
        include: { createdBy: { select: { name: true, email: true }}}
    });
}

