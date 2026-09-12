import { Router } from 'express';
import authRouter from '../modules/auths/auth.route';
import { userRoutes } from '../modules/users/users.routes';
import { refreshTokensRoutes } from '../modules/refreshTokens/refreshTokens.routes';
import { tourGuideProfilesRoutes } from '../modules/tourGuideProfiles/tourGuideProfiles.routes';
import { userPreferencesRoutes } from '../modules/userPreferences/userPreferences.routes';
import { destinationsRoutes } from '../modules/destinations/destinations.routes';
import { toursRoutes } from '../modules/tours/tours.routes';
import { tourBookingsRoutes } from '../modules/tourBookings/tourBookings.routes';
import { itinerariesRoutes } from '../modules/itineraries/itineraries.routes';
import { itineraryDetailsRoutes } from '../modules/itineraryDetails/itineraryDetails.routes';
import { budgetsRoutes } from '../modules/budgets/budgets.routes';
import { postsRoutes } from '../modules/posts/posts.routes';
import { postLikesRoutes } from '../modules/postLikes/postLikes.routes';
import { commentsRoutes } from '../modules/comments/comments.routes';
import { chatsRoutes } from '../modules/chats/chats.routes';
import { chatParticipantsRoutes } from '../modules/chatParticipants/chatParticipants.routes';
import { messagesRoutes } from '../modules/messages/messages.routes';
import { travelCompanionsRoutes } from '../modules/travelCompanions/travelCompanions.routes';
import { reportsRoutes } from '../modules/reports/reports.routes';
import { guideApplicationsRoutes } from '../modules/guideApplications/guideApplications.routes';

const router = Router();

// Mount all module routes here
router.use('/auth', authRouter);
router.use('/users', userRoutes);
router.use('/refresh-tokens', refreshTokensRoutes);
router.use('/tour-guide-profiles', tourGuideProfilesRoutes);
router.use('/user-preferences', userPreferencesRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/tours', toursRoutes);
router.use('/tour-bookings', tourBookingsRoutes);
router.use('/itineraries', itinerariesRoutes);
router.use('/itinerary-details', itineraryDetailsRoutes);
router.use('/budgets', budgetsRoutes);
router.use('/posts', postsRoutes);
router.use('/post-likes', postLikesRoutes);
router.use('/comments', commentsRoutes);
router.use('/chats', chatsRoutes);
router.use('/chat-participants', chatParticipantsRoutes);
router.use('/messages', messagesRoutes);
router.use('/travel-companions', travelCompanionsRoutes);
router.use('/reports', reportsRoutes);
router.use('/guide-applications', guideApplicationsRoutes);

export default router;
