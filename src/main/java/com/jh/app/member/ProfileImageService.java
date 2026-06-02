package com.jh.app.member;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ProfileImageService {

    @Value("${app.upload.base-dir}")
    private String baseDir;

    /**
     * 범용적으로 첨부 파일을 물리적으로 저장하고 관련 메타데이터 엔티티 객체를 생성하는 메소드
     * @param file 업로드할 MultipartFile 객체
     * @param domain 저장할 서브 디렉토리 명칭 (예: 'members', 'boards' 등)
     * @return 파일 메타데이터 정보가 담긴 MemberProfileDTO
     */
    public MemberProfileDTO saveProfileImage(MultipartFile file, String domain) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // C:/upload/members/ 등의 형식으로 조립
            String targetPath = baseDir + "/" + domain + "/";
            File dir = new File(targetPath);

            // C드라이브가 불가능하거나 권한 부족 시 워크스페이스 상대 경로(upload/{domain}/)로 Fallback 우회
            if (!dir.exists() && !dir.mkdirs()) {
                targetPath = "upload/" + domain + "/";
                dir = new File(targetPath);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
            }

            String originalFileName = file.getOriginalFilename();
            String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            String filePath = targetPath + storedFileName;
            long fileSize = file.getSize();

            // 물리 파일 복사 저장
            file.transferTo(new File(filePath));

            // 프로필 메타데이터 DTO 생성 및 리턴
            MemberProfileDTO profile = new MemberProfileDTO();
            profile.setOriginalFileName(originalFileName);
            profile.setStoredFileName(storedFileName);
            profile.setFilePath(filePath);
            profile.setFileSize(fileSize);
            profile.setCreatedAt(LocalDateTime.now());
            
            return profile;
        } catch (IOException e) {
            throw new RuntimeException("물리 파일 저장 중 IO 에러가 발생했습니다: " + e.getMessage(), e);
        }
    }
}
