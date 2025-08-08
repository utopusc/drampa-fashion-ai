export interface PoseData {
  id: string;
  name: string;
  tag: string;
  description?: string;
}

export const poses: PoseData[] = [
  {
    id: 'standing-straight',
    name: 'Standing Straight',
    tag: 'standing straight, facing camera, professional pose',
    description: 'Professional frontal pose'
  },
  {
    id: 'casual-lean',
    name: 'Casual Lean',
    tag: 'casual leaning pose, relaxed, one hand in pocket',
    description: 'Relaxed leaning pose'
  },
  {
    id: 'walking',
    name: 'Walking',
    tag: 'walking pose, dynamic, mid-stride',
    description: 'Dynamic walking motion'
  },
  {
    id: 'sitting',
    name: 'Sitting',
    tag: 'sitting pose, elegant, crossed legs',
    description: 'Elegant sitting pose'
  },
  {
    id: 'side-profile',
    name: 'Side Profile',
    tag: 'side profile pose, looking away',
    description: 'Profile view pose'
  },
  {
    id: 'hands-on-hips',
    name: 'Hands on Hips',
    tag: 'confident pose, hands on hips, power stance',
    description: 'Confident power pose'
  },
  {
    id: 'crossed-arms',
    name: 'Crossed Arms',
    tag: 'crossed arms, professional, confident',
    description: 'Professional crossed arms'
  },
  {
    id: 'looking-back',
    name: 'Looking Back',
    tag: 'looking back over shoulder, elegant',
    description: 'Over the shoulder pose'
  }
];