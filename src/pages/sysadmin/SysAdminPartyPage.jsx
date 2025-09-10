import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AvatarGroup,
  Avatar,
} from "@mui/material";

export default function SysAdminPartyPage() {
  const { t } = useTranslation();
  const [parties, setParties] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setParties([
      {
        id: 1,
        name: "Party A",
        members: [
          { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
          { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
          { id: 3, name: "Bob Johnson", avatar: "/avatar3.jpg" },
          { id: 4, name: "Alice Brown", avatar: "/avatar4.jpg" },
        ],
      },
      {
        id: 2,
        name: "Party B",
        members: [
          { id: 5, name: "Charlie Wilson", avatar: "/avatar5.jpg" },
          { id: 6, name: "Diana Davis", avatar: "/avatar6.jpg" },
        ],
      },
    ]);
  }, []);

  return (
    <TableContainer component={Paper}>
      <title>{t("pages.sysAdmin.parties.title")}</title>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Party Name</TableCell>
            <TableCell>Members</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parties.map((party) => (
            <TableRow key={party.id}>
              <TableCell>{party.name}</TableCell>
              <TableCell>
                <AvatarGroup max={3}>
                  {party.members.map((member) => (
                    <Avatar
                      key={member.id}
                      alt={member.name}
                      src={member.avatar}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
