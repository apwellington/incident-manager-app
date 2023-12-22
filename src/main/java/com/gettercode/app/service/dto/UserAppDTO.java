package com.gettercode.app.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.gettercode.app.domain.UserApp} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserAppDTO implements Serializable {

    private Long id;

    @NotNull
    private String phone;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserAppDTO)) {
            return false;
        }

        UserAppDTO userAppDTO = (UserAppDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userAppDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserAppDTO{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
