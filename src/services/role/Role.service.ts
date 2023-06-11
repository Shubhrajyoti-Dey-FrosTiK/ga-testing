import { checkRole } from "../../routes/Role.controller";
import { ResponseDto } from "../../dto/response.dto";

export default class RoleService {
  async verifyRole(email: string, role: string): Promise<boolean> {
    const roleResponse = await checkRole({
      headers: { email },
    });

    console.log(roleResponse);

    if (roleResponse.error) return false;
    else
      return roleResponse.data &&
        Array.isArray(roleResponse.data) &&
        roleResponse.data.includes(role)
        ? true
        : false;
  }
}
