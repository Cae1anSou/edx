package org.openedx.backend.common.security;

import java.util.Set;

public record AuthContext(
        String userId,
        Set<String> roles,
        Set<String> permissions,
        Set<String> researchGroups
) {

    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    public boolean hasPermission(String permission) {
        return permissions.contains(permission);
    }

    public boolean hasResearchGroup(String group) {
        return researchGroups.contains(group);
    }
}
