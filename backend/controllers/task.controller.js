export const getATask = async (req, res) => {
    try {
        
    } catch (e) {
        const errRes = jsonRes(false, `Failed to get task`, e.message)
        res.status(400).json(errRes);
    }
}