import { Router, type IRouter } from "express";
import healthRouter from "./health";
import brandRouter from "./brand";
import templatesRouter from "./templates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(brandRouter);
router.use(templatesRouter);

export default router;
